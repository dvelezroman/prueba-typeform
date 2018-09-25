import {
  STORE_QUESTION,
  ADD_QUESTION,
  CLEAR_QUESTION
} from "../actionTypes/FormQuestions";

const initial_state = {
  question: {
    text: "",
    speciality: ""
  },
  questions: []
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case STORE_QUESTION:
      return Object.assign({}, state, { question: action.payload });
    case ADD_QUESTION:
      return Object.assign({}, state, {
        questions: [...state.questions, state.question]
      });
    case CLEAR_QUESTION:
      return Object.assign({}, state, {
        question: {
          text: "",
          speciality: ""
        }
      });
    default:
      return state;
  }
};
