import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Paper } from "@material-ui/core";

import logo from "../ReactTypescript.png";

interface IProps {}

class HomeComponent extends React.Component {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}></div>
        <Card
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            height: "90%"
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "left"
            }}>
            <Paper
              style={{
                width: "100%",
                padding: "5px"
              }}>
              <CardContent style={{ backgroundColor: "white" }}>
                <div>
                  <img src={logo} alt="Logo" />;
                </div>
              </CardContent>
            </Paper>
          </div>
        </Card>
      </div>
    );
  }
}
export default HomeComponent;
