import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import questionsReducer from "./questionsReducer";
import typeFormReducer from "./typeFormReducer";

export default combineReducers({
  simpleReducer,
  questionsReducer,
  typeFormReducer
});
