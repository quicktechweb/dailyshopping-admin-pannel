import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "https://dailyshopping-backend.onrender.com/api", // 🟢 env থেকে baseURL
  // timeout: 10000ddddd, 
});

export default axiosInstance;
