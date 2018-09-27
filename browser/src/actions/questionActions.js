import {
  STORE_QUESTION,
  ADD_QUESTION,
  CLEAR_QUESTION
} from "../actionTypes/FormQuestions";

export const storeQuestion = question => dispatch => {
  dispatch({
    type: STORE_QUESTION,
    payload: question
  });
};

export const addQuestion = () => dispatch => {
  dispatch({
    type: ADD_QUESTION
  });
};

export const clearQuestion = () => dispatch => {
  dispatch({
    type: CLEAR_QUESTION
  });
};
