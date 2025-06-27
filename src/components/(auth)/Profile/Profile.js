import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailUser, updateUser } from "../../../services/userService";
import { USER_REFRESH } from "../../../redux/actions/UserAction";
import "./Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const { account, isLoading, isError } = useSelector((state) => state.user);
  const [userDetail, setUserDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    email: "",
    username: "",
    phone: "",
    address: "",
    sex: "",
    groupId: "",
  });

  useEffect(() => {
    let userId = account.id || localStorage.getItem("id");

    if (userId) {
      fetchUserDetail(userId);
    } else {
      console.error("No userId available for fetching profile");
    }
    dispatch({ type: USER_REFRESH });
  }, [dispatch, account.id]);

  const fetchUserDetail = async (id) => {
    try {
      const response = await getDetailUser(id);
      console.log("API Response (getDetailUser):", response);
      if (response && response.EC === "0") {
        setUserDetail(response.DT);
        setEditValues({
          email: response.DT.email || "",
          username: response.DT.username || "",
          phone: response.DT.phone || "",
          address: response.DT.address || "",
          sex: response.DT.sex || "",
          groupId: response.DT.groupId || "",
        });
      } else {
        console.log("Failed to fetch user detail:", response?.EM);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userId = account.id || localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found");

      const response = await updateUser(
        userId,
        editValues.username,
        editValues.email,
        editValues.phone,
        editValues.sex,
        editValues.address,
        editValues.groupId
      );
      if (response.EC === "0") {
        setUserDetail({ ...userDetail, ...editValues });
        setIsEditing(false);
        console.log("User updated successfully");
      } else {
        console.log("Failed to update user:", response.EM);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset editValues to current userDetail
    setEditValues({
      email: userDetail?.email || "",
      username: userDetail?.username || "",
      phone: userDetail?.phone || "",
      address: userDetail?.address || "",
      sex: userDetail?.sex || "",
      groupId: userDetail?.groupId || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  if (!account.isAuthenticated) return <div>Please log in to view profile</div>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-card">
        {isEditing ? (
          <>
            <div className="profile-item">
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={editValues.email}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-item">
              <strong>Username:</strong>
              <input
                type="text"
                name="username"
                value={editValues.username}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-item">
              <strong>Phone:</strong>
              <input
                type="text"
                name="phone"
                value={editValues.phone}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-item">
              <strong>Address:</strong>
              <input
                type="text"
                name="address"
                value={editValues.address}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-item">
              <strong>Sex:</strong>
              <input
                type="text"
                name="sex"
                value={editValues.sex}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-item">
              <strong>Group ID:</strong>
              <input
                type="text"
                name="groupId"
                value={editValues.groupId}
                onChange={handleInputChange}
                className="border p-1 rounded ml-2"
              />
            </div>
            <div className="profile-actions">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-item">
              <strong>Email:</strong> {userDetail?.email || account.email}
            </div>
            <div className="profile-item">
              <strong>Username:</strong> {userDetail?.username || "N/A"}
            </div>
            <div className="profile-item">
              <strong>Phone:</strong> {userDetail?.phone || "N/A"}
            </div>
            <div className="profile-item">
              <strong>Address:</strong> {userDetail?.address || "N/A"}
            </div>
            <div className="profile-item">
              <strong>Sex:</strong> {userDetail?.sex || "N/A"}
            </div>
            <div className="profile-item">
              <strong>Group ID:</strong> {userDetail?.groupId || "N/A"}
            </div>
            <div className="profile-actions">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
