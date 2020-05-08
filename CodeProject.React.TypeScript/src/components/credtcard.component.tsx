import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import ReferenceField from "../shared/reference-fields";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormatterNumberComponent from "../shared/formatter.number.component";
import InputLabel from "@material-ui/core/InputLabel";

import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { CreditCardComponentState } from "./creditcard.component.state";
import FormHelperText from "@material-ui/core/FormHelperText";

interface IProps {
  handleChange: any;
  creditCardTypeNotSelected: boolean;
  counter: number;
}

const creditCardComponentState = new CreditCardComponentState();
type State = Readonly<typeof creditCardComponentState>;

class CreditCardComponent extends React.Component<IProps> {
  readonly state: State = creditCardComponentState;
  creditCardTypeSelected: boolean;

  creditCardNumberRef: any = React.createRef();
  nameOnCreditCardRef: any = React.createRef();
  creditCardCVVNumberRef: any = React.createRef();
  creditCardExpirationMonthRef: any = React.createRef();
  creditCardExpirationYearRef: any = React.createRef();

  references: Array<ReferenceField>;

  constructor(props: IProps) {
    super(props);
    this.creditCardTypeSelected = false;
    this.references = [
      {
        propertyName: "creditCardNumber",
        referenceField: this.creditCardNumberRef
      },
      {
        propertyName: "nameOnCreditCard",
        referenceField: this.nameOnCreditCardRef
      },
      {
        propertyName: "creditCardExpirationMonth",
        referenceField: this.creditCardExpirationMonthRef
      },
      {
        propertyName: "creditCardExpirationYear",
        referenceField: this.creditCardExpirationYearRef
      }
    ];
  }

  componentWillReceiveProps = (props: IProps) => {
    console.log(this.state.creditCardTypeNotSelected);
    if (this.creditCardTypeSelected === false) {
      this.setState({
        creditCardTypeNotSelected: this.props.creditCardTypeNotSelected
      });
    }
    this.setState({ counter: this.props.counter });
  };

  componentDidMount() {
    ValidatorForm.addValidationRule("isRequired", value => {
      if (value === null || value === undefined || value.length === 0) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isValidCreditCardNumber", value => {
      if (value === null || value === undefined || value.length === 0) {
        return false;
      }

      if (this.state.creditCardType === "AmericanExpress") {
        if (value.length !== 14) {
          return false;
        }
        if (
          value.startsWith("34") === false &&
          value.startsWith("37") === false
        ) {
          return false;
        }
        return true;
      }

      if (this.state.creditCardType === "Visa") {
        if (value.startsWith("4") === false) {
          return false;
        }
        if (value.length === 13 || value.length === 16) {
          return true;
        }
        return false;
      }

      if (this.state.creditCardType === "MasterCard") {
        if (value.length !== 16) {
          return false;
        }
        if (
          value.startsWith("51") === false &&
          value.startsWith("54") === false &&
          value.startsWith("55") === false
        ) {
          return false;
        }
      }

      return true;
    });

    ValidatorForm.addValidationRule("isCVVNumberValid", value => {
      if (value === null || value === undefined || value.length < 3) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isMonthValid", value => {
      if (value === null || value === undefined || value.length < 2) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isCreditCardYearValid", value => {
      let year = parseInt(value);
      if (
        value === null ||
        value === undefined ||
        value.length < 4 ||
        year < 2019
      ) {
        return false;
      }
      return true;
    });
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

  handleFocus = (event: any) => {
    let targetName: string = event.target.name + "Focused";
    this.setState({ [targetName]: true });
  };

  handleBlur = (event: any) => {
    let targetName: string = event.target.name + "Focused";
    this.setState({ [targetName]: false });
  };

  handleChange = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
    this.props.handleChange(event);
  };

  handleCreditCardTypeChange = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
    this.setState({ creditCardTypeNotSelected: false });

    this.creditCardTypeSelected = true;

    if (event.target.value === "AmericanExpress") {
      this.setState({ creditCardNumberPlaceholder: "####-#####-#####" });
      this.setState({ creditCardCVVNumberPlaceholder: "####" });
    } else {
      this.setState({ creditCardNumberPlaceholder: "####-####-####-####" });
      this.setState({ creditCardCVVNumberPlaceholder: "###" });
    }
    this.props.handleChange(event);
  };

  handleCreditCardTypeOnBlur = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
    this.setState({ creditCardTypeNotSelected: false });
    if (this.state.creditCardType.length === 0) {
      this.setState({ creditCardTypeNotSelected: true });
    }
    this.props.handleChange(event);
  };

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl
              margin="normal"
              fullWidth
              error={this.state.creditCardTypeNotSelected}
            >
              <InputLabel htmlFor="creditCardType">Credit Card Type</InputLabel>
              <Select
                required
                value={this.state.creditCardType}
                onChange={this.handleCreditCardTypeChange}
                onBlur={this.handleCreditCardTypeOnBlur}
                name="creditCardType"
              >
                <MenuItem value="" disabled>
                  Select Credit Card Type
                </MenuItem>
                <MenuItem value={"MasterCard"}>MasterCard</MenuItem>
                <MenuItem value={"Visa"}>Visa</MenuItem>
                <MenuItem value={"AmericanExpress"}>American Express</MenuItem>
              </Select>
              {this.state.creditCardTypeNotSelected && (
                <FormHelperText>Credit Card Type is required</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl margin="normal" fullWidth>
              <TextValidator
                ref={this.nameOnCreditCardRef}
                label="Name On Credit Card *"
                onChange={this.handleChange}
                onBlur={this.validateRequiredField}
                value={this.state.nameOnCreditCard}
                name="nameOnCreditCard"
                validators={["isRequired"]}
                errorMessages={["Name on credit card is required"]}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl margin="normal" fullWidth>
              <TextValidator
                ref={this.creditCardNumberRef}
                label="Credit Card Number *"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                placeholder={this.state.creditCardNumberPlaceholder}
                value={this.state.creditCardNumber}
                name="creditCardNumber"
                validators={["isRequired", "isValidCreditCardNumber"]}
                errorMessages={[
                  "Credit Card Number is required",
                  "Credit Card Number is invalid"
                ]}
                InputProps={{
                  inputComponent: FormatterNumberComponent as any
                }}
                InputLabelProps={{
                  focused: this.state.creditCardNumberFocused
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl margin="normal" fullWidth>
              <TextValidator
                ref={this.creditCardCVVNumberRef}
                label="CVV *"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                placeholder={this.state.creditCardCVVNumberPlaceholder}
                value={this.state.creditCardCVVNumber}
                name="creditCardCVVNumber"
                validators={["isRequired", "isCVVNumberValid"]}
                errorMessages={[
                  "CVV number is required",
                  "CVV number is invalid"
                ]}
                InputProps={{
                  inputComponent: FormatterNumberComponent as any
                }}
                InputLabelProps={{
                  focused: this.state.creditCardNumberFocused
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl margin="normal" fullWidth>
              <TextValidator
                ref={this.creditCardExpirationMonthRef}
                label="Expiration Month *"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                placeholder="##"
                value={this.state.creditCardExpirationMonth}
                name="creditCardExpirationMonth"
                validators={["isRequired", "isMonthValid"]}
                errorMessages={[
                  "Expiration Month is required",
                  "Expiration Month is invalid"
                ]}
                InputProps={{
                  inputComponent: FormatterNumberComponent as any
                }}
                InputLabelProps={{
                  focused: this.state.creditCardExpirationMonthFocused
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
            <FormControl margin="normal" fullWidth>
              <TextValidator
                ref={this.creditCardExpirationYearRef}
                label="Expiration Year *"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                placeholder="####"
                value={this.state.creditCardExpirationYear}
                name="creditCardExpirationYear"
                validators={["isRequired", "isCreditCardYearValid"]}
                errorMessages={[
                  "Expiration Year is required",
                  "Expiration Year is invalid"
                ]}
                InputProps={{
                  inputComponent: FormatterNumberComponent as any
                }}
                InputLabelProps={{
                  focused: this.state.creditCardExpirationYearFocused
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CreditCardComponent;
