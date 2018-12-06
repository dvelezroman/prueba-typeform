import axios from "axios";

import {
  LOADING_FILE,
  STORE_REGS,
  CLEAR_REGS
} from "../actionTypes/UploadFile";

const loadingFile = () => ({
  type: LOADING_FILE
});

const storeRegs = fileName => dispatch => {
  axios
    .get(`/api/orders/${fileName}`)
    .then(res => res.data)
    .then(orders => {
      dispatch({
        type: STORE_REGS,
        payload: orders
      });
    });
};

export const clearRegs = () => ({
  type: CLEAR_REGS
});

export const uploadFile = file => dispatch => {
  //dispatch(loadingFile()); //sets loading to true
  const url = "/api/upload";
  const formData = new FormData();
  formData.append("file", file);
  const config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  };
  return axios.post(url, formData, config).then(res => {
    //console.log("Respuesta luego de subir archivo : ", res.data);
    let fileName = file.name.split(".")[0];
    //dispatch(storeRegs(fileName));
    //dispatch(loadingFile()); // sets loading to false
    return res.data;
  });
};
