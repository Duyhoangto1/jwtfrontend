import axiosInstance from "./axios";

const registerNewUser = (email, phone, username, password) => {
  try {
    const response = axiosInstance.post("/register", {
      email,
      phone,
      username,
      password,
    });
    return response;
  } catch (error) {
    console.log("Api error", error);
    throw error;
  }
};
const loginUser = (email, password) => {
  return axiosInstance.post("/login", { email, password });
};

const getListUser = () => {
  return axiosInstance.get("/listUser");
};

const getDetailUser = (id) => {
  try {
    console.log(" Fetching user with id:", id); // Debug id
    const response = axiosInstance.get(`/getDetailUser/${id}`); // Sử dụng path parameter
    return response;
  } catch (error) {
    console.log(" API error:", error);
    throw error;
  }
};
const updateUser = (id, username, email, phone, sex, address, groupId) => {
  try {
    const response = axiosInstance.put(`/updateUser/${id}`, {
      username,
      email,
      phone,
      sex,
      address,
      groupId,
    }); // Sử dụng path parameter
    return response;
  } catch (error) {
    console.log(" API error:", error);
    throw error;
  }
};

const deleteUser = (id) => {
  try {
    const response = axiosInstance.delete(`/deleteUser/${id}`);
    return response;
  } catch (error) {
    console.log(" API error:", error);
    throw error;
  }
};

const createUser = (
  email,
  phone,
  username,
  password,
  sex,
  address,
  groupId
) => {
  try {
    const response = axiosInstance.post("/createUser", {
      email,
      phone,
      username,
      password,
      sex,
      address,
      groupId,
    });
    return response;
  } catch (error) {
    console.log("API error:", error);
    throw error;
  }
};
export {
  registerNewUser,
  loginUser,
  getListUser,
  getDetailUser,
  updateUser,
  deleteUser,
  createUser,
};
