import axios from "axios";
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",

  headers: {
        "Content-type": "application/json",
    },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
     const token = localStorage.getItem("token");
  
 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }}
  return config;
});

export default API;
