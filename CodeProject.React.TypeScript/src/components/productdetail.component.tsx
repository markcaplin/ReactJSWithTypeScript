import React from "react";
import httpService from "../services/http.service";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ReferenceField from "../shared/reference-fields";
import EditIcon from "@material-ui/icons/Edit";
import FormatterCurrencyComponent from "../shared/formatter.currency.component";
import FormatterNumberComponent from "../shared/formatter.number.component";

import { ProductDetailComponentState } from "./productdetail.component.state";
import { RouteComponentProps } from "react-router-dom";
import { displayErrorMessage, displaySuccessMessage } from "../store/actions";
import { ProductDetailViewModelResponse } from "../viewmodels/product-detail-response.viewmodel";
import { FormControl, Paper, InputAdornment } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { ShoppingCartViewModel } from "../viewmodels/shopping-cart-viewmodel";

interface MatchParams {
  id: string;
}

interface productDetailComponentProps
  extends RouteComponentProps<MatchParams> {}

const productDetailComponentState = new ProductDetailComponentState();
type State = Readonly<typeof productDetailComponentState>;

class ProductDetailComponent extends React.Component<
  productDetailComponentProps
> {
  readonly state: State = productDetailComponentState;
  orderQuantityRef: any = React.createRef();
  productId: string;
  references: Array<ReferenceField>;

  constructor(props: productDetailComponentProps) {
    super(props);
    this.productId = this.props.match.params.id;
    if (this.productId === undefined) {
      this.productId = "";
    }
    this.references = [
      { propertyName: "orderQuantity", referenceField: this.orderQuantityRef }
    ];
  }

  componentDidMount() {
    this.setState({ productId: this.productId });
    this.getProductDetail();

    ValidatorForm.addValidationRule("isRequired", value => {
      if (
        value === null ||
        value === undefined ||
        value.length === 0 ||
        value < 1
      ) {
        return false;
      }
      return true;
    });
  }

  getProductDetail = () => {
    let thisComponent: any = this;
    httpService
      .getProductDetail(this.productId)
      .then(function(response: ProductDetailViewModelResponse) {
        if (response.returnStatus === true) {
          thisComponent.updateDetail(response);
        } else {
          thisComponent.displayErrorMessage(response.returnMessage[0]);
        }
      });
  };

  updateDetail = (response: ProductDetailViewModelResponse) => {
    this.setState({ product: response.entity });
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.addToCart();
  };

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

  addToCart = () => {
    let shoppingCartItems = [];

    const existingShoppingCart = localStorage.getItem("ReactShoppingCart");

    if (existingShoppingCart !== null) {
      shoppingCartItems = JSON.parse(existingShoppingCart);
    }

    let shoppingCartItem = new ShoppingCartViewModel();

    shoppingCartItem.productId = this.state.product.productId;
    shoppingCartItem.description = this.state.product.description;
    shoppingCartItem.longDescription = this.state.product.longDescription;
    shoppingCartItem.productNumber = this.state.product.productNumber;
    shoppingCartItem.unitPrice = this.state.product.unitPrice;
    shoppingCartItem.orderQuantity = this.state.orderQuantity;

    let existingItem = shoppingCartItems.filter(
      (c: any) => c.productId === shoppingCartItem.productId
    );

    if (existingItem.length === 0) {
      shoppingCartItems.push(shoppingCartItem);
    } else {
      existingItem[0].orderQuantity =
        existingItem[0].orderQuantity + shoppingCartItem.orderQuantity;
    }

    let localStorageCart = JSON.stringify(shoppingCartItems);
    localStorage.setItem("ReactShoppingCart", localStorageCart);

    this.props.history.push("/shoppingcart");
  };

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Product Detail</div>
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
                  id="OrderForm"
                  debounceTime={1500}
                  instantValidate={false}
                  onSubmit={this.handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" disabled={true} fullWidth>
                        <TextValidator
                          id="productNumber"
                          label="Product Number"
                          value={this.state.product.productNumber}
                          name="productNumber"
                          InputLabelProps={{
                            focused: false
                          }}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          id="description"
                          label="Description"
                          value={this.state.product.description}
                          name="description"
                          InputLabelProps={{
                            focused: false
                          }}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} xl={6} md={12} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          label="Summary"
                          value={this.state.product.longDescription}
                          name="longDescription"
                          multiline={true}
                          InputLabelProps={{
                            focused: false
                          }}
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          label="Unit Price"
                          value={this.state.product.unitPrice}
                          name="unitPrice"
                          InputProps={{
                            inputComponent: FormatterCurrencyComponent as any,
                            readOnly: true
                          }}
                          InputLabelProps={{
                            focused: false
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} xl={3} md={6} lg={6}>
                      <FormControl margin="normal" fullWidth>
                        <TextValidator
                          ref={this.orderQuantityRef}
                          label="Order Quantity *"
                          onChange={this.handleChange}
                          onBlur={this.handleBlur}
                          onFocus={this.handleFocus}
                          value={this.state.orderQuantity}
                          placeholder="#######"
                          name="orderQuantity"
                          validators={["isRequired"]}
                          errorMessages={["Order Quantity is required"]}
                          InputProps={{
                            inputComponent: FormatterNumberComponent as any,
                            endAdornment: (
                              <InputAdornment position="end">
                                <EditIcon />
                              </InputAdornment>
                            )
                          }}
                          InputLabelProps={{
                            focused: this.state.orderQuantityFocused
                          }}
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
                  form="OrderForm"
                >
                  Add To Cart
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
  displayErrorMessage,
  displaySuccessMessage
};

export default connect(
  null,
  mapDispatchToProps
)(ProductDetailComponent);
