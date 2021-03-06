import {
  STORE_QUESTION,
  ADD_QUESTION,
  CLEAR_QUESTION,
  STORING_QUESTION_DB,
  PUT_QUESTIONS_STORE,
  GETTING_QUESTIONS_DB,
  PUT_GROUPS_STORE
} from "../actionTypes/FormQuestions";

const initial_state = {
  question: {
    title: "",
    description: "",
    speciality: "",
    group: ""
  },
  questions: [],
  groups: [],
  filter: "all",
  storing: false,
  getting: false
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
          title: "",
          description: "",
          speciality: ""
        },
        storing: false
      });
    case STORING_QUESTION_DB:
      return Object.assign({}, state, { storing: action.payload });
    case PUT_QUESTIONS_STORE:
      return Object.assign({}, state, { questions: [...action.payload] });
    case GETTING_QUESTIONS_DB:
      return Object.assign({}, state, { getting: action.payload });
    case PUT_GROUPS_STORE:
      return Object.assign({}, state, { groups: [...action.payload] });
    default:
      return state;
  }
};
