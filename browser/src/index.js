import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./store";

import "typeface-roboto";
import "./styles/index.css";
import Main from "./Containers/Main";
//import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <Route path="/" component={Main} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
//registerServiceWorker();
