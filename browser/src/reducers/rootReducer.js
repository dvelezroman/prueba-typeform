import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import questionsReducer from "./questionsReducer";
import typeFormReducer from "./typeFormReducer";
import uploadReducer from "./uploadReducer";

export default combineReducers({
  simpleReducer,
  questionsReducer,
  typeFormReducer,
  uploadReducer
});
