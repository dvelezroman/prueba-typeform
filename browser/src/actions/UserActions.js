import axios from "axios";

import { LOGIN, UNLOGIN } from "../actionTypes/User";

export const storeUser = user => ({
  type: LOGIN,
  payload: user // { id, name, email}
});

export const clearUser = () => ({
  type: UNLOGIN
});

export const loginUser = userInfo => dispatch =>
  axios.post("/api/login", userInfo);
