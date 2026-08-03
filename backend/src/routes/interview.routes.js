const express = require("express")
const {authUser} = require("../middlewares/auth.middleware")
const {generateInterViewReportController,getInterviewReportByIdController,getAllInterviewReportsController} = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



interviewRouter.post("/", authUser, upload.single("resume"), generateInterViewReportController);
    
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController);

interviewRouter.get("/reports", authUser, getAllInterviewReportsController);
module.exports = interviewRouter;