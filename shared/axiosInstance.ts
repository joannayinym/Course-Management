import axios from "axios";
import storage from "./storage";

const axiosInstance = axios.create({
  baseURL: "https://cms.chtoma.com/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + storage?.token,
  },
});

export default axiosInstance;
