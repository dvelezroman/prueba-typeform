import {
  GET_FORM,
  CREATE_FORM,
  FORM_CREATED,
  FORM_CREATION_FAILED
} from "../actionTypes/TypeForm";

const initial_state = {
  form: {},
  isCreatingForm: false,
  message: ""
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_FORM: {
      return Object.assign({}, ...state, { form: action.payload });
    }
    case CREATE_FORM: {
      return Object.assign({}, ...state, { isCreatingForm: true, message: "" });
    }
    case FORM_CREATED: {
      return Object.assign({}, ...state, {
        isCreatingForm: false,
        message: "El Cuestionario se creó..."
      });
    }
    case FORM_CREATION_FAILED: {
      return Object.assign({}, ...state, {
        isCreatingForm: false,
        message: `${action.payload}`
      });
    }
    default:
      return state;
  }
};
