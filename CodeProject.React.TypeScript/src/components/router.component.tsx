import React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {}

class RouterComponent extends React.Component<IProps> {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>about</h1>
      </div>
    );
  }
}

export default withRouter(RouterComponent);
