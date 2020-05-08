export const UPDATE_USER = "UPDATE_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const START_PROCESSING = "START_PROCESSING";
export const STOP_PROCESSING = "STOP_PROCESSING";
export const ERROR_MESSAGE = "ERROR_MESSAGE";
export const INFO_MESSAGE = "INFO_MESSAGE";
export const WARNING_MESSAGE = "WARNING_MESSAGE";
export const SUCCESS_MESSAGE = "SUCCESS_MESSAGE";

export interface IUserState {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  emailAddress: string;
  phoneNumber: string;
  lastLogin: Date;
  isAuthenicated: boolean;
  authenicationCounter: number;
}

export interface IProcessingState {
  processing: boolean;
}
export interface IMessageState {
  messageType: string;
  message: string;
  counter: number;
}

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  userInformation: IUserState;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
  userInformation: IUserState;
}

interface StartProcessingAction {
  type: typeof START_PROCESSING;
  processing: boolean;
}

interface StopProcessingAction {
  type: typeof STOP_PROCESSING;
  processing: boolean;
}

interface ErrorMessageAction {
  type: typeof ERROR_MESSAGE;
  messageInformation: string;
  messageType: string;
}

interface SuccessMessageAction {
  type: typeof SUCCESS_MESSAGE;
  messageInformation: string;
  messageType: string;
}

interface WarningMessageAction {
  type: typeof WARNING_MESSAGE;
  messageInformation: string;
  messageType: string;
}

interface InfoMessageAction {
  type: typeof INFO_MESSAGE;
  messageInformation: string;
  messageType: string;
}

export type MessageActionTypes =
  | SuccessMessageAction
  | ErrorMessageAction
  | WarningMessageAction
  | InfoMessageAction;
export type UserActionTypes = UpdateUserAction | LogoutUserAction;
export type ProcessingActionTypes =
  | StartProcessingAction
  | StopProcessingAction;
