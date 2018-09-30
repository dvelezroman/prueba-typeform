import axios from "axios";

import {
  GET_FORM,
  CREATE_FORM,
  FORM_CREATED,
  FORM_CREATION_FAILED
} from "../actionTypes/TypeForm";

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
  const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";
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
