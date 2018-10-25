import { SET_ADMIN } from "../actionTypes/Admin";

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN:
      return true;
    default:
      return state;
  }
};
