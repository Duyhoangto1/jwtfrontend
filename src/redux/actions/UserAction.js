import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";

export const USER_LOGIN = "USER_LOGIN";
export const USER_REFRESH = "USER_REFRESH";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";
export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const loginUserRedux = (email, password) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_LOGIN });
    try {
      const response = await loginUser(email, password);
      if (response && response.EC === 0) {
        const userData = {
          isAuthenticated: true,
          token: response.data?.token || "fake token",
          user: response.data || {},
        };
        // Lưu vào sessionStorage nếu muốn
        sessionStorage.setItem("account", JSON.stringify(userData));
        toast.success(response.EM || "Login success!");
        dispatch({
          type: USER_LOGIN_SUCCESS,
          data: userData,
        });
      } else {
        toast.error(response?.EM || "Login failed!");
        dispatch({ type: USER_LOGIN_FAIL, payload: response });
      }
    } catch (error) {
      toast.error("Login failed!");
      dispatch({ type: USER_LOGIN_FAIL, payload: error });
    }
  };
};

export const logoutUserRedux = () => {
  return (dispatch, getState) => {
    sessionStorage.removeItem("account");
    dispatch({ type: USER_LOGOUT });
  };
};

export const handleRefresh = () => {
  return (dispatch, getState) => {
    dispatch({ type: USER_REFRESH });
  };
};
