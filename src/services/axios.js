import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 10000, // Set a timeout of 10 seconds
});
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
    console.log("Request made with ", config);
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error: ", error);
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response.data ? response.data : { statusCode: response.status }; // Return response data or the whole response
  },
  function (error) {
    let res = {};
    if (error.response) {
      res.response = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
      // Sử dụng switch case để xử lý lỗi dựa trên status code
      switch (error.response.status) {
        case 400:
          res.errorMessage = "Bad Request: Please check your input data.";
          toast.error("Bad Request: Please check your input data.");
          console.log(" 400 Error:", res.response);
          break;
        case 401:
          res.errorMessage = "Unauthorized: Please log in again.";
          toast.error("Unauthorized: Please log in again.");
          console.log(" 401 Error:", res.response);
          window.location.href("/login");
          // Có thể thêm logic redirect hoặc logout
          break;
        case 403:
          res.errorMessage = "Forbidden: You do not have permission.";
          toast.error("Forbidden: You do not have permission.");
          console.log(" 403 Error:", res.response);
          break;
        case 500:
          res.errorMessage = "Internal Server Error: Please try again later.";
          toast.error("Internal Server Error: Please try again later.");
          console.log(" 500 Error:", res.response);
          break;
        default:
          res.errorMessage = `Unexpected error with status ${error.response.status}.`;
          console.log(" Default Error:", res.response);
      }
    } else if (error.request) {
      // Lỗi do không nhận được response (e.g., mạng)
      res.errorMessage = "No response from server. Check your network.";
      console.log(" Network Error:", error.request);
    } else {
      // Lỗi cấu hình hoặc khác
      res.errorMessage = "Error setting up request: " + error.message;
      console.log(" Setup Error:", error.message);
    }

    return res;
  }
);

export default axiosInstance;
