import axiosInstance from "./axios";

export const getRoles = async () => {
  try {
    return await axiosInstance.get("/roles");
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (getRoles):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to get roles",
      status: error.response?.status || 500,
    };
  }
};

export const getGroups = async () => {
  try {
    return await axiosInstance.get("/group"); // Giả định endpoint
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (getGroups):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to get groups",
      status: error.response?.status || 500,
    };
  }
};

export const createRole = async (url, description) => {
  try {
    const response = await axiosInstance.post("/roles", { url, description });
    return response.data;
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (createRole):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to create role",
      status: error.response?.status || 500,
    };
  }
};

export const updateRole = async (id, url, description) => {
  try {
    const response = await axiosInstance.put(`/roles/${id}`, {
      url,
      description,
    });
    return response.data;
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (updateRole):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to update role",
      status: error.response?.status || 500,
    };
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (deleteRole):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to delete role",
      status: error.response?.status || 500,
    };
  }
};

export const assignRoleToGroup = async (roleId, groupId) => {
  try {
    const response = await axiosInstance.post("/group-role", {
      roleId,
      groupId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "[12:06 AM +07, 27/06/2025] API error (assignRoleToGroup):",
      error.response?.data || error.message
    );
    throw {
      error: true,
      message: error.response?.data?.EM || "Failed to assign role to group",
      status: error.response?.status || 500,
    };
  }
};
