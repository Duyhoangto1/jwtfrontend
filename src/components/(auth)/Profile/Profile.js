import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailUser } from "../../../services/userService";
import { USER_REFRESH } from "../../../redux/actions/UserAction";
import "./Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const { account, isLoading, isError } = useSelector((state) => state.user);
  const [userDetail, setUserDetail] = React.useState(null);

  useEffect(() => {
    let userId = account.id || localStorage.getItem("id"); // Ưu tiên account.id, fallback sang localStorage

    if (userId) {
      fetchUserDetail(userId);
    } else {
      console.error(
        "[11:29 PM +07, 26/06/2025] No userId available for fetching profile"
      );
    }
    dispatch({ type: USER_REFRESH }); // Refresh state từ localStorage
  }, [dispatch, account.id]); // Theo dõi account.id thay vì account.token

  const fetchUserDetail = async (id) => {
    try {
      const response = await getDetailUser(id);
      console.log(
        "[11:29 PM +07, 26/06/2025] API Response (getDetailUser):",
        response
      );
      if (response && response.EC === "0") {
        // Kiểm tra cấu trúc response
        setUserDetail(response.DT);
      } else {
        console.log(
          "[11:29 PM +07, 26/06/2025] Failed to fetch user detail:",
          response?.EM
        );
      }
    } catch (error) {
      console.error(
        "[11:29 PM +07, 26/06/2025] Error fetching user detail:",
        error
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  if (!account.isAuthenticated) return <div>Please log in to view profile</div>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-card">
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
      </div>
    </div>
  );
};

export default Profile;
