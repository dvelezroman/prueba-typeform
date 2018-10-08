import { LOGIN, UNLOGIN } from "../actionTypes/User";

const initialState = {
  token: null,
  user: {
    id: null,
    name: "",
    email: ""
  },
  logged: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, ...state, {
        user: { ...action.payload },
        logged: true
      });
    case UNLOGIN:
      return Object.assign({}, ...initialState);
    default:
      return state;
  }
};
