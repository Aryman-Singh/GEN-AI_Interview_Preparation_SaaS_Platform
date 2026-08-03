const pdfParser = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

const generateInterViewReportController = async (req, res) => {
  const resumeContent = await (
    new pdfParser.PDFParse(Uint8Array.from(req.file.buffer))
  ).getText();

  const { selfDescription, jobDescription } = req.body;

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

   

  const dataToSave = {
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interViewReportByAi,
  };

 

  const interViewReport = await interviewReportModel.create(dataToSave);
 

  res.status(201).json({
    message: "Interview report generated successfully",
    interViewReport,
  });
};

const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  try {
    const interViewReport = await interviewReportModel.findById(interviewId);
    if (!interViewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    res.status(200).json({ message: "Interview report fetched successfully", interViewReport });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllInterviewReportsController = async (req, res) => {
  try {
    const interViewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    res.status(200).json({ message: "Interview reports fetched successfully", interViewReports });
  } catch (error) {
    console.error("Error fetching interview reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController };