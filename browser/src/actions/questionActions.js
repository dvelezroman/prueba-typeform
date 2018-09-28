import axios from "axios";

import {
  STORE_QUESTION,
  ADD_QUESTION,
  CLEAR_QUESTION,
  STORING_QUESTION_DB,
  PUT_QUESTIONS_STORE,
  GETTING_QUESTIONS_DB,
  PUT_GROUPS_STORE
} from "../actionTypes/FormQuestions";

const putQuestionsDB = questions => dispatch => {
  dispatch({
    type: PUT_QUESTIONS_STORE,
    payload: questions
  });
};

const putGroupsStore = groups => dispatch => {
  dispatch({
    type: PUT_GROUPS_STORE,
    payload: groups
  });
};

const gettingQuestionsDB = value => dispatch => {
  dispatch({
    type: GETTING_QUESTIONS_DB,
    payload: value
  });
};

const storingQuestionDB = value => dispatch => {
  dispatch({
    type: STORING_QUESTION_DB,
    payload: value
  });
};

export const storeQuestion = question => dispatch => {
  dispatch({
    type: STORE_QUESTION,
    payload: question
  });
};

export const addQuestion = () => dispatch => {
  // una vez que ya la pregunta se guarde en la base de datos, ya no necesito esta action
  dispatch({
    type: ADD_QUESTION
  });
};

export const clearQuestion = () => dispatch => {
  dispatch({
    type: CLEAR_QUESTION
  });
};

export const storeQuestionInDB = question => dispatch => {
  dispatch(storingQuestionDB(true));
  axios
    .post("http://localhost:3001/api/questions/new", question)
    .then(res => res.data)
    .then(() => {
      dispatch(storingQuestionDB(false));
    });
};

export const getQuestionsDB = () => dispatch => {
  dispatch(gettingQuestionsDB(true));
  axios
    .get("http://localhost:3001/api/questions")
    .then(res => res.data)
    .then(questions => {
      dispatch(gettingQuestionsDB(false));
      dispatch(putQuestionsDB(questions));
    });
};

export const getGroupsDB = () => dispatch => {
  axios
    .get("http://localhost:3001/api/groups")
    .then(res => res.data)
    .then(data => {
      let groups = data.map(group => ({
        value: group.id,
        label: group.description
      }));
      dispatch(putGroupsStore(groups));
    });
};
