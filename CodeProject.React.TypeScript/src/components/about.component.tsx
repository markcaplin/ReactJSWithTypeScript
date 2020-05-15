import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Paper } from "@material-ui/core";

interface IProps {}

class AboutComponent extends React.Component {
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
            marginRight: "20px"
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
                  <h2>About Mark</h2>

                  <p>
                    Mark Caplin has specialized in Information Technology solutions for the past 30 years. Specializing
                    in full life-cycle development projects for both enterprise-wide systems and Internet/Intranet based
                    solutions. For the past fifteen years, Mark has specialized in the Microsoft .NET framework using C#
                    as his tool of choice. For the past four years Mark has been implementing Single Page Applications
                    using the Angular platform. When not coding, Mark enjoys playing tennis, listening to U2, watching
                    the Miami Dolphins and watching movies in Blu-Ray technology. In between all this, his wife of 30
                    years, feeds him well with some great home cooked meals. You can contact Mark at
                    mark.caplin@gmail.com
                  </p>
                </div>
              </CardContent>
            </Paper>
          </div>
        </Card>
      </div>
    );
  }
}
export default AboutComponent;
