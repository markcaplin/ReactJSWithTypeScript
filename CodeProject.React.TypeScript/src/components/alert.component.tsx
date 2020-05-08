import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SnackbarContent from "@material-ui/core/SnackbarContent";

//import { amber } from "@material-ui/core/colors";
import { IMessageState } from "../store/types";
import { Store } from "redux";

import "./alert.component.css";
import { AlertComponentState } from "./alert.component.state";

interface IProps {
  reduxStore: Store;
}

const alertComponentState = new AlertComponentState();
type State = Readonly<typeof alertComponentState>;

class AlertComponent extends React.Component<IProps> {
  readonly state: State = alertComponentState;
  unsubscribe: any;
  constructor(props: IProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const backgroundColor = "errorBackgroundColor";
    const iconType = "errorIcon";
    this.setState({ backgroundColor: this.state[backgroundColor] });
    this.setState({ icon: this.state[iconType] });
    this.setState({ initialLoad: false });
    this.unsubscribe = this.props.reduxStore.subscribe(
      this.handleChange.bind(this)
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleClose(event: any) {
    this.setState({ openAlertMessage: false });
  }

  handleChange() {
    let messageInformation: IMessageState = this.props.reduxStore.getState()
      .messageInformation;

    if (messageInformation === undefined) {
      return;
    }

    if (messageInformation.message === undefined) {
      return;
    }

    if (messageInformation.counter === this.state.messageCounter) {
      return;
    }

    this.setState({ messageCounter: messageInformation.counter });

    let messageToShow = messageInformation.message;

    this.setState({ messageToDisplay: messageToShow });
    this.setState({ openAlertMessage: true });

    if (messageInformation.messageType === "error") {
      const backgroundColor = "errorBackgroundColor";
      const iconType = "errorIcon";
      this.setState({ backgroundColor: this.state[backgroundColor] });
      this.setState({ icon: this.state[iconType] });
      return;
    }

    if (messageInformation.messageType === "success") {
      const backgroundColor = "successBackgroundColor";
      const iconType = "successIcon";
      this.setState({ backgroundColor: this.state[backgroundColor] });
      this.setState({ icon: this.state[iconType] });
      return;
    }
  }

  render() {
    const Icon = this.state.initialLoad ? CheckCircleIcon : this.state.icon;
    return (
      <div>
        <Snackbar
          style={{ width: "90%" }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={this.state.openAlertMessage}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: this.state.backgroundColor
            }}
            message={
              <span
                id="client-snackbar"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Icon style={{ fontSize: 20, opacity: 0.9, marginRight: 8 }} />
                {this.state.messageToDisplay}
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

export default AlertComponent;
