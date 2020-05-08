import { UserInformationViewModel } from "../viewmodels/user-information.viewmodel";
import { IUserState, UPDATE_USER, LOGOUT_USER, UserActionTypes } from "./types";
import {
  START_PROCESSING,
  STOP_PROCESSING,
  ProcessingActionTypes
} from "./types";

import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  INFO_MESSAGE,
  WARNING_MESSAGE,
  MessageActionTypes
} from "./types";

export function updateUser(userInformation: IUserState): UserActionTypes {
  return {
    type: UPDATE_USER,
    userInformation: userInformation
  };
}

export function logoutUser(): UserActionTypes {
  return {
    type: LOGOUT_USER,
    userInformation: new UserInformationViewModel()
  };
}

export function startProcessing(): ProcessingActionTypes {
  return {
    type: START_PROCESSING,
    processing: true
  };
}

export function stopProcessing(): ProcessingActionTypes {
  return {
    type: STOP_PROCESSING,
    processing: false
  };
}

export function displayErrorMessage(message: string): MessageActionTypes {
  return {
    type: ERROR_MESSAGE,
    messageType: "error",
    messageInformation: message
  };
}

export function displaySuccessMessage(message: string): MessageActionTypes {
  return {
    type: SUCCESS_MESSAGE,
    messageType: "success",
    messageInformation: message
  };
}

export function displayInfoMessage(message: string): MessageActionTypes {
  return {
    type: INFO_MESSAGE,
    messageType: "info",
    messageInformation: message
  };
}

export function displayWarningMessage(message: string): MessageActionTypes {
  return {
    type: WARNING_MESSAGE,
    messageType: "warning",
    messageInformation: message
  };
}
