import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
} from "../services/interview.api";
import { useParams } from "react-router";


export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
  } = context;

  const generateReport = async ({
    resume,
    selfDescription,
    jobDescription,
  }) => {
    setLoading(true);

    let response = null;

    try {
      response = await generateInterviewReport({
        resume,
        selfDescription,
        jobDescription,
      });

      setReport(response.interViewReport);

      
    } catch (error) {
      console.error("Failed to generate interview report:", error);
      return null;
    } finally {
      setLoading(false);
    }
    return response.interViewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    let response = null;

    try {
      response = await getInterviewReportById(interviewId);

      setReport(response.interViewReport);

      
    } catch (error) {
      console.error("Failed to fetch interview report:", error);
      return null;
    } finally {
      setLoading(false);
    }
    return response.interViewReport;
  };

  const getReports = async () => {
    setLoading(true);

    let response = null;

    try {
      response = await getAllInterviewReports();

      setReports(response.interViewReports);

    } catch (error) {
      console.error("Failed to fetch interview reports:", error);
      return [];
    } finally {
      setLoading(false);
    }
    
      return response.interViewReports;
  };

  useEffect(() => {
     if(interviewId){
      getReportById(interviewId)
     }else{
        getReports()
     }
    
      
   }, [interviewId])
  

  return {
    loading,
    report,
    reports,

    generateReport,
    getReportById,
    getReports,

    setLoading,
    setReport,
    setReports,
  };
};