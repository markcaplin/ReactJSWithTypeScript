import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";

import { blue } from "@material-ui/core/colors";
import { ProgressBarComponentState } from "./progressbar.component.state";
import { Store } from "redux";
import { IProcessingState } from "../store/types";

interface IProps {
  reduxStore: Store;
}

const progressBarComponentState = new ProgressBarComponentState();
type State = Readonly<typeof progressBarComponentState>;

class ProgressBarComponent extends React.Component<IProps> {
  readonly state: State = progressBarComponentState;
  unsubscribe: any;

  componentDidMount() {
    this.unsubscribe = this.props.reduxStore.subscribe(this.handleChange.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange() {
    let processingInformation: IProcessingState = this.props.reduxStore.getState().processingInformation;

    if (processingInformation.processing === false) {
      // simulate long running process to demo the progress bar
      setTimeout(() => {
        this.setState({ processing: processingInformation.processing });
      }, 1000);
    } else {
      this.setState({ processing: processingInformation.processing });
    }
  }

  render() {
    return (
      <div
        color="primary"
        style={{
          height: "5px",
          marginTop: 0,
          backgroundColor: blue[800]
        }}>
        <LinearProgress
          color="primary"
          style={{
            display: this.state.processing ? "block" : "none",
            visibility: this.state.processing ? "visible" : "hidden"
          }}
        />
        <Dialog style={{ opacity: 0.1 }} fullScreen={true} open={this.state.processing} />
      </div>
    );
  }
}

export default ProgressBarComponent;
