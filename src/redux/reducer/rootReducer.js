import { combineReducers } from "redux";
// Import your reducers here
import userReducer from "./userReducer";
// import other reducers as needed

const rootReducer = combineReducers({
  user: userReducer,
  // add other reducers here
});

export default rootReducer;
