import axiosInstance from "./axios";

const getGroup = () => {
  return axiosInstance.get("/group");
};

export { getGroup };
