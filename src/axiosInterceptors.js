import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // const navigate = error.config.extraData?.navigate;
    if (
      error.response.data.message === "Please Login to access this resource" ||
      (error.response.data.message === "Json Web Token is Expired, Try again" &&
        !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      const response = await axios
        .get("http://localhost:4000/api/v1/user/refresh-token", {
          withCredentials: true,
        })
        .catch(() => {
          localStorage.clear();
          document.cookie.clear();
          window.location.href = "/";
          toast.error("Session Terminated");
        });
      originalRequest.headers.Authorization = `Bearer ${response?.data?.accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
