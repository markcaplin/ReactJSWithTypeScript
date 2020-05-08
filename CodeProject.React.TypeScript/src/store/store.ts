import { IUserState, IMessageState } from "./types";

// Create an interface for the application state
export interface IApplicationState {
  userInformation: IUserState;
  processing: boolean;
  messageInformation: IMessageState;
}
