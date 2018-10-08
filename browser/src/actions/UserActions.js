import axios from "axios";

import { LOGIN, UNLOGIN } from "../actionTypes/User";

const storeUser = user => ({
  action: LOGIN,
  payload: user // { id, name, email}
});

export const loginUser = userInfo => dispatch => {
  axios
    .post("/login", userInfo)
    .then(res => res.data)
    .then(user => {
      if (user.success) {
        dispatch(storeUser(user.data));
      }
    });
};
