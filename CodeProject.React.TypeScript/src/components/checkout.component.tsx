import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShippingInformationComponent from "./shippinginformation.component";
import CreditCardComponent from "./credtcard.component";
import httpService from "../services/http.service";

import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { displayErrorMessage, displaySuccessMessage } from "../store/actions";
import { CheckoutComponentState } from "./checkout.component.state";
import { ValidatorForm } from "react-material-ui-form-validator";
import { OrderViewModel } from "../viewmodels/order.viewmodel";
import { OrderDetailViewModel } from "../viewmodels/order-detail.viewmodel";

const checkoutComponentState = new CheckoutComponentState();
type State = Readonly<typeof checkoutComponentState>;

type CheckoutComponentProps = RouteComponentProps;

class CheckoutComponent extends React.Component<CheckoutComponentProps> {
  readonly state: State = checkoutComponentState;
  checkoutInformation: any;
  counter: number;

  constructor(props: CheckoutComponentProps) {
    super(props);
    this.checkoutInformation = new CheckoutComponentState();
    this.counter = 0;
  }

  componentDidMount = () => {};

  handleChange = (event: any) => {
    const targetName: string = event.target.name;
    this.checkoutInformation[targetName] = event.target.value;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.placeOrder();
  };

  validateForm = () => {
    let checkout: CheckoutComponentState = this.checkoutInformation;
    if (checkout.creditCardType.length === 0) {
      this.setState({ creditCardTypeNotSelected: true });
    }
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  };

  public placeOrder = () => {
    let thisComponent: any = this;

    let shoppingCartItems = [];
    const existingShoppingCart = localStorage.getItem("ReactShoppingCart");

    if (existingShoppingCart == null) {
      return;
    }

    shoppingCartItems = JSON.parse(existingShoppingCart);

    let orderViewModel = new OrderViewModel();

    orderViewModel.firstName = this.checkoutInformation.firstName;
    orderViewModel.lastName = this.checkoutInformation.lastName;
    orderViewModel.addressLine1 = this.checkoutInformation.addressLine1;
    orderViewModel.addressLine2 = this.checkoutInformation.addressLine2;
    orderViewModel.city = this.checkoutInformation.city;
    orderViewModel.state = this.checkoutInformation.state;
    orderViewModel.zipCode = this.checkoutInformation.zipCode;
    orderViewModel.creditCardNumber = this.checkoutInformation.creditCardNumber;

    orderViewModel.orderDetails = [];

    shoppingCartItems.forEach((detail: OrderDetailViewModel) => {
      let orderDetail = new OrderDetailViewModel();
      orderDetail.productId = detail.productId;
      orderDetail.description = detail.description;
      orderDetail.orderQuantity = detail.orderQuantity;
      orderDetail.productNumber = detail.productNumber;
      orderDetail.unitPrice = detail.unitPrice;
      orderViewModel.orderDetails.push(orderDetail);
    });

    httpService.createOrder(orderViewModel).then(function(response: any) {
      if (response.returnStatus === true) {
        thisComponent.orderCreated(response);
      } else {
        thisComponent.errorCreatingOrder(response);
      }
    });
  };

  orderCreated = (response: any) => {
    localStorage.removeItem("ReactShoppingCart");
    this.props.history.push("/orders");
  };

  errorCreatingOrder = (response: any) => {
    let thisComponent: any = this;
    thisComponent.props.displayErrorMessage(response.returnMessage[0]);
  };

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Checkout</div>
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
                id="CheckoutForm"
                instantValidate={true}
                onSubmit={this.handleSubmit}
              >
                <Typography variant="h6">Shipping Information</Typography>
                <ShippingInformationComponent
                  handleChange={this.handleChange}
                />
                <div style={{ marginTop: "10px" }}>&nbsp;</div>
                <Typography variant="h6">Credit Card Information</Typography>
                <CreditCardComponent
                  counter={this.counter}
                  handleChange={this.handleChange}
                  creditCardTypeNotSelected={
                    this.state.creditCardTypeNotSelected
                  }
                />
              </ValidatorForm>
            </div>
          </CardContent>
          <CardActions style={{ backgroundColor: "white" }}>
            <Button
              onClick={this.validateForm}
              color="primary"
              variant="contained"
              type="submit"
              form="CheckoutForm"
            >
              Place Order
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
)(CheckoutComponent);
