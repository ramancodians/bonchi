import axios from "axios";
import cookies from "js-cookie";

axios.interceptors.request.use(
  (config) => {
    const authToken = cookies.get("AUTH_TOKEN");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("Axios response error:", error);
    const {
      response: { status },
    } = error;
    // if (status === 401 && !isPublicPath()) {
    //   window.localStorage.removeItem("AUTH_TOKEN");
    //   window.location = "/login";
    // }
    return Promise.reject(error);
  }
);
