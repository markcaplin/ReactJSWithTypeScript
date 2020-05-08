import * as React from "react";
import "./index.css";
import "typeface-roboto";

import MasterComponent from "./components/master.component";
import axios from "axios";
import store from "./store/reduxStoreInstance";

import { render } from "react-dom";
import { Provider } from "react-redux";
import { UPDATE_USER } from "./store/types";
import { UserInformationViewModel } from "./viewmodels/user-information.viewmodel";

//
//  http interceptors
//
axios.interceptors.request.use(
  config => {
    const token: any = localStorage.getItem("ReactToken");
    if (token != null && token !== undefined) {
      config.headers.Authorization = "Bearer " + token;
      config.headers.Accept = "application/json";
    }
    config.headers.Accept = "application/json";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const UNAUTHORIZED: number = 401;

axios.interceptors.response.use(
  response => response,
  error => {
    const status: any = error.response.status;
    if (status === UNAUTHORIZED) {
      window.location.replace("http://localhost:3000/login");
    }
    return Promise.reject(error);
  }
);

//
//  user authenication on application start-up/refresh
//
let user: UserInformationViewModel = new UserInformationViewModel();
user.emailAddress = "";
user.firstName = "";
user.lastName = "";
user.id = "";
user.isAuthenicated = false;

let token: any = localStorage.getItem("ReactToken");
if (token == null || token === undefined) {
  user.isAuthenicated = false;
} else {
  let jwt: any = JSON.parse(atob(token.split(".")[1]));

  user.emailAddress = jwt.emailAddress;
  user.firstName = jwt.given_name;
  user.lastName = jwt.nameid;
  user.id = jwt.primarysid;
  user.isAuthenicated = true;

  let currentTime: number = Date.now() / 1000;
  if (jwt.exp < currentTime) {
    user.isAuthenicated = false;
  }
}

store.dispatch({ type: UPDATE_USER, userInformation: user });

interface IProps {}
//type masterComponentProps = IProps & RouteComponentProps;

render(
  <Provider store={store}>
    <MasterComponent userInformation={user} reduxStore={store} />
  </Provider>,
  document.getElementById("root")
);
