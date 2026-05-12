import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with every request
});
