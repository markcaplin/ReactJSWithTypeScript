import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import ReferenceField from '../shared/reference-fields';
import FormatterPhoneNumberComponent from '../shared/formatter.phonenumber.component';
import FormatterZipCodeComponent from '../shared/formatter.zipcode.component';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { ShippingInformationComponentState } from './shippinginformation.component.state';

interface IProps {
    handleChange: any;
}

const shippingInformationComponentState = new ShippingInformationComponentState();
type State = Readonly<typeof shippingInformationComponentState>;

class ShippingInformationComponent extends React.Component<IProps> {
    readonly state: State = shippingInformationComponentState;

    firstNameRef: any = React.createRef();
    lastNameRef: any = React.createRef();
    addressLine1Ref: any = React.createRef();
    addressLine2Ref: any = React.createRef();
    cityRef: any = React.createRef();
    stateRef: any = React.createRef();
    zipCodeRef: any = React.createRef();
    phoneNumberRef: any = React.createRef();

    references: Array<ReferenceField>;

    constructor(props: IProps) {
        super(props);
        this.references = [
            { propertyName: 'firstName', referenceField: this.firstNameRef },
            { propertyName: 'lastName', referenceField: this.lastNameRef },
            { propertyName: 'addressLine1', referenceField: this.addressLine1Ref },
            { propertyName: 'addressLine2', referenceField: this.addressLine2Ref },
            { propertyName: 'city', referenceField: this.cityRef },
            { propertyName: 'state', referenceField: this.stateRef },
            { propertyName: 'zipCode', referenceField: this.zipCodeRef },
            { propertyName: 'phoneNumber', referenceField: this.phoneNumberRef }
        ];
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isRequired', value => {
            if (value === null || value === undefined || value.length === 0) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isPhoneNumber', value => {
            if (value === null || value === undefined || value.length < 10) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isZipCode', value => {
            if (value === null || value === undefined || value.length < 5 || (value.length > 5 && value.length < 9)) {
                return false;
            }
            return true;
        });
    }

    validateRequiredField = (event: any) => {
        let reference = this.references.find(x => x.propertyName === event.target.name);
        if (reference !== undefined && reference !== null) {
            let referenceField = reference.referenceField;
            referenceField.current.validate(event.target.value);
        }
    };

    handleFocus = (event: any) => {
        let targetName: string = event.target.name + 'Focused';
        this.setState({ [targetName]: true });
    };

    handleBlur = (event: any) => {
        let targetName: string = event.target.name + 'Focused';
        this.setState({ [targetName]: false });
    };

    handleChange = (event: any) => {
        let targetName: string = event.target.name;
        this.setState({ [targetName]: event.target.value });
        this.props.handleChange(event);
    };

    render() {
        return (
            <div>
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
                                validators={['isRequired']}
                                errorMessages={['First Name is required']}
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
                                validators={['isRequired']}
                                errorMessages={['Last Name is required']}
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
                                validators={['isRequired']}
                                errorMessages={['Address line 1 is required']}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                        <FormControl margin="normal" fullWidth>
                            <TextValidator label="Address Line 2" onChange={this.handleChange} value={this.state.addressLine2} name="addressLine2" />
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
                                validators={['isRequired']}
                                errorMessages={['City is required']}
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
                                validators={['isRequired']}
                                errorMessages={['State is required']}
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
                                validators={['isRequired', 'isZipCode']}
                                errorMessages={['Zip Code is required', 'Zip Code is invalid']}
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
                                validators={['isRequired', 'isPhoneNumber']}
                                errorMessages={['Phone Number is required', 'Phone Number is invalid']}
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
            </div>
        );
    }
}

export default ShippingInformationComponent;
