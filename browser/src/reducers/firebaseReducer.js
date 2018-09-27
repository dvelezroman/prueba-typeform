import {
  QUESTIONS_TO_STORAGE
} from "../actionTypes/Firebase";

const initial_state = {
  questions = []
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case QUESTIONS_TO_STORAGE:
      return Object.assign({}, ...state, { questions: [...action.payload] });
    default: return state;
  }
}