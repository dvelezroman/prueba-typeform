import { firebaseDataBase } from "../services/firebase";
import { QUESTIONS_TO_STORAGE } from "../actionTypes/Firebase";

const questionsToStorage = questions => dispatch => {
  dispatch({
    type: QUESTIONS_TO_STORAGE,
    payload: questions
  });
};

export const storeQuestionDB = question => dispatch =>
  firebaseDataBase
    .ref(`questions/`)
    .push(question)
    .then(res => getQuestionsDB())
    .catch(err => err);

export const getQuestionsDB = () => dispatch =>
  firebaseDataBase
    .ref("/questions/")
    .once("value")
    .then(snapshot => {
      let questions = [];
      snapshot.forEach(childSnapshot => {
        const { key } = childSnapshot;
        let question = childSnapshot.val();
        question.key = key;
        questions.push(question);
      });
      dispatch(questionsToStorage(questions));
    });
