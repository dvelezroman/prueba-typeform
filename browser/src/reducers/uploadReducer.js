import {
  LOADING_FILE,
  STORE_REGS,
  CLEAR_REGS
} from "../actionTypes/UploadFile";

const initial_state = {
  orders: [],
  loading: false
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_FILE: {
      let value = state.loading;
      return Object.assign({}, state, { loading: !value });
    }
    case STORE_REGS: {
      return Object.assign({}, state, { orders: [...action.payload] });
    }
    case CLEAR_REGS: {
      return initial_state;
    }
    default:
      return state;
  }
};
