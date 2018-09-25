import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import questionsReducer from "./questionsReducer";

export default combineReducers({
  simpleReducer,
  questionsReducer
});
