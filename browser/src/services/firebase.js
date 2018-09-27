import * as firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDBLMAaoHpFaTUBguxyhMa32KpCC8vmf9I",
  authDomain: "prueba-typeform.firebaseapp.com",
  databaseURL: "https://prueba-typeform.firebaseio.com",
  projectId: "prueba-typeform",
  storageBucket: "",
  messagingSenderId: "294466795981"
};
firebase.initializeApp(config);

export const authentication = firebase.auth();
export const firebaseDataBase = firebase.database();
export const firebaseStorage = firebase.storage();
