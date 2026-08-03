import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const generateInterviewReport=async({resume, selfDescription, jobDescription}) => {
const formData = new FormData();
formData.append("resume", resume);
formData.append("selfDescription", selfDescription);
formData.append("jobDescription", jobDescription);

  const response = await api.post("/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data" 
    }
  
  });

  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/interview/report/${interviewId}`);
  return response.data;
};

export const getAllInterviewReports  = async () => {
  const response = await api.get("/interview/reports");
  return response.data;
};