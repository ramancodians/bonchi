import axios, { AxiosError } from "axios";
import cookies from "js-cookie";
import { toast } from "react-toastify";

axios.interceptors.request.use(
  (config) => {
    const authToken = cookies.get("AUTH_TOKEN");
    console.log("Axios request config:", authToken);
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.log("Axios request error:", error);
    toast.error("Request failed. Please try again.");
    return Promise.reject(error);
  }
);
