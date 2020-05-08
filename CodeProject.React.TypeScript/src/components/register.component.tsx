import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import httpService from "../services/http.service";
import ReferenceField from "../shared/reference-fields";
import FormatterPhoneNumberComponent from "../shared/formatter.phonenumber.component";
import FormatterZipCodeComponent from "../shared/formatter.zipcode.component";

import { connect } from "react-redux";
import { displayErrorMessage, displaySuccessMessage } from "../store/actions";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { UserViewModel } from "../viewmodels/user.viewmodel";
import { RouteComponentProps } from "react-router-dom";
import { FormControl } from "@material-ui/core";
import { RegisterComponentState } from "./register.component.state";

interface IProps {}

const registerComponentState = new RegisterComponentState();

type RegisterComponentProps = IProps & RouteComponentProps;
type State = Readonly<typeof registerComponentState>;

class RegisterComponent extends React.Component<RegisterComponentProps> {
  readonly state: State = registerComponentState;

  emailAddressRef: any = React.createRef();
  passwordRef: any = React.createRef();
  passwordConfirmationRef: any = React.createRef();
  firstNameRef: any = React.createRef();
  lastNameRef: any = React.createRef();
  addressLine1Ref: any = React.createRef();
  addressLine2Ref: any = React.createRef();
  cityRef: any = React.createRef();
  stateRef: any = React.createRef();
  zipCodeRef: any = React.createRef();
  phoneNumberRef: any = React.createRef();

  public references: Array<ReferenceField>;

  constructor(props: RegisterComponentProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.references = [
      { propertyName: "password", referenceField: this.passwordRef },
      {
        propertyName: "passwordConfirmation",
        referenceField: this.passwordConfirmationRef
      },
      { propertyName: "firstName", referenceField: this.firstNameRef },
      { propertyName: "lastName", referenceField: this.lastNameRef },
      { propertyName: "addressLine1", referenceField: this.addressLine1Ref },
      { propertyName: "addressLine2", referenceField: this.addressLine2Ref },
      { propertyName: "city", referenceField: this.cityRef },
      { propertyName: "state", referenceField: this.stateRef },
      { propertyName: "zipCode", referenceField: this.zipCodeRef },
      { propertyName: "phoneNumber", referenceField: this.phoneNumberRef }
    ];
  }

  validateRequiredField = (event: any) => {
    let reference = this.references.find(
      x => x.propertyName === event.target.name
    );
    if (reference !== undefined && reference !== null) {
      let referenceField = reference.referenceField;
      referenceField.current.validate(event.target.value);
    }
  };

  handleSubmit(event: any) {
    event.preventDefault();
    this.register();
  }

  handleChange = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
  };

  handleFocus = (event: any) => {
    let targetName: string = event.target.name + "Focused";
    this.setState({ [targetName]: true });
  };

  handleBlur = (event: any) => {
    let targetName: string = event.target.name + "Focused";
    this.setState({ [targetName]: false });
  };

  validateEmailAddress = (event: any) => {
    let emailAddress: string = event.target.value;
    this.setState({ emailAddressOnBlur: true });

    if (
      emailAddress === null ||
      emailAddress === undefined ||
      emailAddress.length === 0
    ) {
      this.setState({ emailAddressIsUnique: false });
      return false;
    }

    let thisComponent: any = this;

    thisComponent.setState({ emailAddressIsUnique: false });

    httpService
      .validateEmailAddress(emailAddress)
      .then(function(response: any) {
        thisComponent.setState({ emailAddressIsUnique: response.returnStatus });
        if (response.returnStatus === false) {
          thisComponent.props.displayErrorMessage(response.returnMessage[0]);
        }
        thisComponent.emailAddressRef.current.validate(emailAddress);
      });
  };

  componentDidMount() {
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isEmailAddressUnique", value => {
      if (this.state.emailAddressOnBlur === true) {
        return this.state.emailAddressIsUnique;
      } else {
        return true;
      }
    });

    ValidatorForm.addValidationRule("isRequired", value => {
      if (value === null || value === undefined || value.length === 0) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isPhoneNumber", value => {
      if (value === null || value === undefined || value.length < 10) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isZipCode", value => {
      if (
        value === null ||
        value === undefined ||
        value.length < 5 ||
        (value.length > 5 && value.length < 9)
      ) {
        return false;
      }
      return true;
    });
  }

  register() {
    let vm: any = this;
    let userViewModel = new UserViewModel();
    userViewModel.firstName = this.state.firstName;
    userViewModel.lastName = this.state.lastName;
    userViewModel.emailAddress = this.state.emailAddress;
    userViewModel.password = this.state.password;
    userViewModel.passwordConfirmation = this.state.passwordConfirmation;
    userViewModel.addressLine1 = this.state.addressLine1;
    userViewModel.addressLine2 = this.state.addressLine2;
    userViewModel.city = this.state.city;
    userViewModel.state = this.state.state;
    userViewModel.zipCode = this.state.zipCode;
    userViewModel.phoneNumber = this.state.phoneNumber;

    httpService.register(userViewModel).then(function(response: any) {
      if (response.returnStatus === true) {
        vm.props.history.push("/login");
        vm.props.displaySuccessMessage("Registration successful...");
      } else {
        vm.props.displayErrorMessage(response.returnMessage[0]);
      }
    });
  }

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Register</div>
        <Card
          style={{
            marginLeft: "20px",
            marginRight: "20px"
          }}
        >
          <CardContent style={{ backgroundColor: "white" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                marginLeft: 5,
                marginTop: 0,
                paddingTop: 0,
                paddingLeft: 5
              }}
            >
              <ValidatorForm
                id="RegisterForm"
                instantValidate={true}
                onSubmit={this.handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.emailAddressRef}
                        label="Email Address *"
                        onChange={this.handleChange}
                        onBlur={this.validateEmailAddress}
                        value={this.state.emailAddress}
                        name="emailAddress"
                        validators={[
                          "isRequired",
                          "isEmail",
                          "isEmailAddressUnique"
                        ]}
                        errorMessages={[
                          "Email Address is required",
                          "Email Address is not valid",
                          "Email Address already exists"
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
                        label="Password *"
                        autoComplete="new-password"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.password}
                        name="password"
                        validators={["isRequired"]}
                        errorMessages={["Password is required"]}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.passwordConfirmationRef}
                        type="password"
                        label="Password Confirmation *"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.passwordConfirmation}
                        name="passwordConfirmation"
                        validators={["isRequired", "isPasswordMatch"]}
                        errorMessages={[
                          "Password Confirmation is required",
                          "Password Confirmation does NOT match"
                        ]}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.firstNameRef}
                        label="First Name"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.firstName}
                        name="firstName"
                        validators={["isRequired"]}
                        errorMessages={["First Name is required"]}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.lastNameRef}
                        label="Last Name *"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.lastName}
                        name="lastName"
                        validators={["isRequired"]}
                        errorMessages={["Last Name is required"]}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.addressLine1Ref}
                        label="Address Line 1 *"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.addressLine1}
                        name="addressLine1"
                        validators={["isRequired"]}
                        errorMessages={["Address line 1 is required"]}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        label="Address Line 2"
                        onChange={this.handleChange}
                        value={this.state.addressLine2}
                        name="addressLine2"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.cityRef}
                        label="City *"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.city}
                        name="city"
                        validators={["isRequired"]}
                        errorMessages={["City is required"]}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.stateRef}
                        label="State *"
                        onChange={this.handleChange}
                        onBlur={this.validateRequiredField}
                        value={this.state.state}
                        name="state"
                        validators={["isRequired"]}
                        errorMessages={["State is required"]}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.zipCodeRef}
                        label="Zip Code *"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        value={this.state.zipCode}
                        placeholder="#####-####"
                        name="zipCode"
                        validators={["isRequired", "isZipCode"]}
                        errorMessages={[
                          "Zip Code is required",
                          "Zip Code is invalid"
                        ]}
                        InputProps={{
                          inputComponent: FormatterZipCodeComponent as any
                        }}
                        InputLabelProps={{
                          focused: this.state.zipCodeFocused
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.phoneNumberRef}
                        label="Phone Number *"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        value={this.state.phoneNumber}
                        placeholder="(###) ###-####"
                        name="phoneNumber"
                        validators={["isRequired", "isPhoneNumber"]}
                        errorMessages={[
                          "Phone Number is required",
                          "Phone Number is invalid"
                        ]}
                        InputProps={{
                          inputComponent: FormatterPhoneNumberComponent as any
                        }}
                        InputLabelProps={{
                          focused: this.state.phoneNumberFocused
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </div>
          </CardContent>
          <CardActions style={{ backgroundColor: "white" }}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              form="RegisterForm"
            >
              Register
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = {
  displayErrorMessage,
  displaySuccessMessage
};

export default connect(
  null,
  mapDispatchToProps
)(RegisterComponent);
