import {
  FETCH_USER_LOGIN,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REFRESH,
} from "../actions/UserAction";

const initialState = {
  account: { email: "", isAuthenticated: false, token: "" },
  isLoading: false,
  isError: false,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_LOGIN:
      return { ...state, isLoading: true, isError: false };
    case USER_LOGIN_SUCCESS:
      // Lưu vào localStorage
      localStorage.setItem("token", action.data.token);
      localStorage.setItem("email", action.data.user.email || "");
      localStorage.setItem("id", action.data.user.id || "");
      return {
        ...state,
        account: {
          email: action.data.user.email || "",
          id: action.data.user.id || "",
          isAuthenticated: true,
          token: action.data.token,
        },
        isLoading: false,
        isError: false,
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        account: { email: "", isAuthenticated: false, token: "" },
        isError: true,
        isLoading: false,
      };
    case USER_LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      return {
        ...state,
        account: { email: "", isAuthenticated: false, token: "" },
        isLoading: false,
        isError: false,
      };
    case USER_REFRESH:
      return {
        ...state,
        account: {
          email: localStorage.getItem("email") || "",
          isAuthenticated: !!localStorage.getItem("token"),
          token: localStorage.getItem("token") || "",
        },
        isLoading: false,
        isError: false,
      };
    default:
      return state;
  }
}

export default userReducer;
