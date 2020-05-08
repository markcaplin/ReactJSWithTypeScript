import { combineReducers } from "redux";
import { UserInformationViewModel } from "../viewmodels/user-information.viewmodel";
import {
  ProcessingActionTypes,
  START_PROCESSING,
  STOP_PROCESSING,
  IMessageState,
  IUserState
} from "./types";

import { UserActionTypes, UPDATE_USER, LOGOUT_USER } from "./types";

import {
  MessageActionTypes,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  WARNING_MESSAGE,
  INFO_MESSAGE
} from "./types";

const initialProcessingState = {
  processing: false
};

function userInformationReducer(state: any = {}, action: UserActionTypes) {
  const currentState: IUserState = state;

  switch (action.type) {
    case UPDATE_USER:
      let counter = isNaN(currentState.authenicationCounter)
        ? 1
        : currentState.authenicationCounter + 1;
      action.userInformation.authenicationCounter = counter;
      return {
        ...state,
        userInformation: action.userInformation,
        authenicationCounter: counter
      };
    case LOGOUT_USER:
      localStorage.removeItem("ReactToken");
      return Object.assign({}, state, {
        userInformation: new UserInformationViewModel(),
        authenicationCounter: isNaN(currentState.authenicationCounter)
          ? 1
          : currentState.authenicationCounter + 1
      });
    default:
      return state;
  }
}

function messageReducer(state: any = {}, action: MessageActionTypes) {
  const currentState: IMessageState = state;

  switch (action.type) {
    case ERROR_MESSAGE:
      return {
        ...state,
        messageType: action.messageType,
        message: action.messageInformation,
        counter: isNaN(currentState.counter) ? 1 : currentState.counter + 1
      };
    case SUCCESS_MESSAGE:
      return {
        ...state,
        messageType: action.messageType,
        message: action.messageInformation,
        counter: isNaN(currentState.counter) ? 1 : currentState.counter + 1
      };
    case INFO_MESSAGE:
      return {
        ...state,
        messageType: action.messageType,
        message: action.messageInformation,
        counter: isNaN(currentState.counter) ? 1 : currentState.counter + 1
      };
    case WARNING_MESSAGE:
      return {
        ...state,
        messageType: action.messageType,
        message: action.messageInformation,
        counter: isNaN(currentState.counter) ? 1 : currentState.counter + 1
      };
    default:
      return state;
  }
}

function processingReducer(
  state = initialProcessingState,
  action: ProcessingActionTypes
) {
  switch (action.type) {
    case START_PROCESSING:
      document.body.style.cursor = "wait";
      return Object.assign({}, state, {
        processing: true
      });
    case STOP_PROCESSING:
      document.body.style.cursor = "default";
      return Object.assign({}, state, {
        processing: false
      });
    default:
      return state;
  }
}

const applicationStore = combineReducers({
  userInformation: userInformationReducer,
  processingInformation: processingReducer,
  messageInformation: messageReducer
});

export default applicationStore;
