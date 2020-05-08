import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import httpService from "../services/http.service";
import ReferenceField from "../shared/reference-fields";

import {
  logoutUser,
  updateUser,
  displayErrorMessage,
  displaySuccessMessage
} from "../store/actions";

import { connect } from "react-redux";
import { FormControl, Paper } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { UserViewModel } from "../viewmodels/user.viewmodel";
import { UserInformationViewModel } from "../viewmodels/user-information.viewmodel";
import { RouteComponentProps } from "react-router-dom";
import { LoginComponentState } from "./login.component.state";

interface IProps {}

const loginComponentState = new LoginComponentState();
type LoginComponentProps = IProps & RouteComponentProps;
type State = Readonly<typeof loginComponentState>;

class LoginComponent extends React.Component<LoginComponentProps> {
  readonly state: State = loginComponentState;
  emailAddressRef: any = React.createRef();
  passwordRef: any = React.createRef();
  references: Array<ReferenceField>;

  constructor(props: LoginComponentProps) {
    super(props);
    this.references = [
      { propertyName: "emailAddress", referenceField: this.emailAddressRef },
      { propertyName: "password", referenceField: this.passwordRef }
    ];
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.login();
  };

  validateRequiredField = (event: any) => {
    let reference = this.references.find(
      x => x.propertyName === event.target.name
    );
    if (reference !== undefined && reference !== null) {
      let referenceField = reference.referenceField;
      referenceField.current.validate(event.target.value);
    }
  };

  componentDidMount() {
    let thisComponent: any = this;
    thisComponent.props.logoutUser();
    ValidatorForm.addValidationRule("isRequired", value => {
      if (value === null || value === undefined || value.length === 0) {
        return false;
      }
      return true;
    });
  }

  handleChange = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
  };

  login() {
    let thisComponent: any = this;

    let userViewModel: UserViewModel = new UserViewModel();
    userViewModel.emailAddress = this.state.emailAddress;
    userViewModel.password = this.state.password;

    httpService.login(userViewModel).then(function(response: any) {
      if (response.returnStatus === true) {
        let token = response.entity.token;
        localStorage.setItem("ReactToken", token);

        let userInformation = new UserInformationViewModel();
        userInformation.firstName = response.entity.firstName;
        userInformation.lastName = response.entity.lastName;
        userInformation.emailAddress = response.entity.emailAddress;
        userInformation.id = response.entity.id;
        userInformation.phoneNumber = response.entity.phoneNumber;
        userInformation.addressLine1 = response.entity.addressLine1;
        userInformation.addressLine2 = response.entity.addressLine2;
        userInformation.city = response.entity.city;
        userInformation.state = response.entity.state;
        userInformation.zipCode = response.entity.zipCode;
        userInformation.isAuthenicated = true;

        thisComponent.props.updateUser(userInformation);

        thisComponent.loginSuccessful();
      } else {
        thisComponent.props.displayErrorMessage(response.returnMessage[0]);
      }
    });
  }

  loginSuccessful = () => {
    let thisComponent: any = this;
    thisComponent.props.history.push("/productinquiry");
    thisComponent.props.displaySuccessMessage("Login successful");
  };

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Login</div>
        <Card
          style={{
            marginLeft: "20px",
            marginRight: "20px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "left"
            }}
          >
            <Paper
              style={{
                width: "100%",
                padding: "5px"
              }}
            >
              <CardContent style={{ backgroundColor: "white" }}>
                <ValidatorForm
                  id="LoginForm"
                  debounceTime={1500}
                  instantValidate={false}
                  onSubmit={this.handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          ref={this.emailAddressRef}
                          label="Email Address *"
                          onChange={this.handleChange}
                          onBlur={this.validateRequiredField}
                          value={this.state.emailAddress}
                          name="emailAddress"
                          validators={["isRequired", "isEmail"]}
                          errorMessages={[
                            "Email Address is required",
                            "Email Address is not valid"
                          ]}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          ref={this.passwordRef}
                          type="password"
                          autoComplete="new-password"
                          label="Password *"
                          onChange={this.handleChange}
                          onBlur={this.validateRequiredField}
                          value={this.state.password}
                          name="password"
                          validators={["isRequired"]}
                          errorMessages={["Password is required"]}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </ValidatorForm>
              </CardContent>
              <CardActions style={{ backgroundColor: "white" }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  form="LoginForm"
                >
                  Login
                </Button>
              </CardActions>
            </Paper>
          </div>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = {
  logoutUser,
  updateUser,
  displayErrorMessage,
  displaySuccessMessage
};

export default connect(
  null,
  mapDispatchToProps
)(LoginComponent);
