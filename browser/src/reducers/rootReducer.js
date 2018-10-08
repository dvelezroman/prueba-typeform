import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import questionsReducer from "./questionsReducer";
import typeFormReducer from "./typeFormReducer";
import uploadReducer from "./uploadReducer";
import userReducer from "./userReducer";

export default combineReducers({
  simpleReducer,
  userReducer,
  questionsReducer,
  typeFormReducer,
  uploadReducer
});
