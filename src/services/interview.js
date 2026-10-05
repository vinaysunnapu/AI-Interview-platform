import axios from "axios";

const BASE_URL = "https://ai-interview-platform-backend-krwy.onrender.com/interview";

export const startInterviewAPI = async (sessionId) => {
  const response = await axios.get(`${BASE_URL}/start/${sessionId}`);
  return response.data;
};


export const submitApi = async (payload) => {
  const response = await axios.post(`${BASE_URL}/submit`, payload);
  return response.data;
};


export const reportApi = async (sessionId) => {
  const response = await axios.get(`${BASE_URL}/report/${sessionId}`);
  return response.data;
};

export const endInterviewApi = async (sessionId) => {
  const response = await axios.put(`${BASE_URL}/end/${sessionId}`);
  return response.data;
};

export const generateQuestionsAPI = async (formData) => {
  const response = await axios.post(`${BASE_URL}/generate_question`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
