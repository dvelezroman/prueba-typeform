import axios from "axios";
import {
  GET_FORM,
  CREATE_FORM,
  FORM_CREATED,
  FORM_CREATION_FAILED
} from "../actionTypes/TypeForm";

const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";

const getForm = form => ({
  type: GET_FORM,
  payload: form
});

export const creatingForm = () => ({
  type: CREATE_FORM
});

export const formCreated = () => ({
  type: FORM_CREATED
});

const formCreationFailed = error => ({
  type: FORM_CREATION_FAILED,
  payload: error
});

export const createForm = data => dispatch => {
  dispatch(creatingForm());
  return axios
    .post("https://api.typeform.com/forms", data, {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.data)
    .then(created => {
      dispatch(getForm(created._links));
      dispatch(formCreated());
    })
    .catch(error => dispatch(formCreationFailed(error)));
};

export const getPollAnswers = ref => dispatch => {
  return axios
    .get(`https://api.typeform.com/forms/${ref}/responses`, { headers: { Authorization: "Bearer " + token }}).then(res => res.data);
};