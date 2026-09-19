import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "http://localhost:5000/api", // 🟢 env থেকে baseURL
  // timeout: 10000ddddd, 
});

export default axiosInstance;
