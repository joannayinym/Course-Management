import axios from "axios";
import storage from "./storage";

const axiosInstance = axios.create({
  baseURL: "https://cms.chtoma.com/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: "Bearer " + storage?.token,
      },
    };
  }

  return config;
});

export default axiosInstance;
