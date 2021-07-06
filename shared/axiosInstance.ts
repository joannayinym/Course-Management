import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cms.chtoma.com/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default axiosInstance;
