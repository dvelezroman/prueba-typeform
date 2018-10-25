import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import questionsReducer from "./questionsReducer";
import typeFormReducer from "./typeFormReducer";
import uploadReducer from "./uploadReducer";
import userReducer from "./userReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
  simpleReducer,
  userReducer,
  questionsReducer,
  typeFormReducer,
  uploadReducer,
  adminReducer
});
