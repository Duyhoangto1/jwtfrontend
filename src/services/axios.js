import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 10000, // Set a timeout of 10 seconds
});

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
    }
    return res;
  }
);

export default axiosInstance;
