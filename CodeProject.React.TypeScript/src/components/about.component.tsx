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

                  <h2>Code Project Articles by Mark</h2>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1368325/Test-Driving-MongoDB-with-NET-Core-2">
                    Test Driving MongoDB with .NET Core
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/5161835/Vue-js-with-TypeScript-for-the-Angular-2plus-Devel">
                    Vue.js with TypeScript for the Angular (2+) Developer
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1250961/Deploying-an-Angular-Application-with-ASP-NET-Core">
                    Deploying an Angular 6 Application with ASP.NET Core 2
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1267590/Developing-Microservices-with-NET-Core-2-1-RabbitM">
                    Developing Microservices with .NET Core 2.1, RabbitMQ, SignalR, EF Core 2.1 and Angular 6
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1193423/Integrating-the-Angular-CLI-With-Visual-Studio">
                    Integrating the Angular 4 CLI With Visual Studio Professional & Visual Studio Code
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1115444/Developing-And-Deploying-An-Angular-Application-Wi">
                    Developing And Deploying An Angular 2 Application With Visual Studio 2015
                  </a>
                </div>

                <div style={{ marginBottom: "5px" }}>
                  <a href="https://www.codeproject.com/Articles/1116876/Developing-An-Angular-Application-With-TypeScript">
                    Developing An Angular 2 Application With TypeScript
                  </a>
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
