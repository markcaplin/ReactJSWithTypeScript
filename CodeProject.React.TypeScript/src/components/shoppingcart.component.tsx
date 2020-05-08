import React from "react";
import DataGridComponent from "../shared/datagrid.component";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";

import { ShoppingCartComponentState } from "./shoppingcart.component.state";
import { GridColumn } from "../viewmodels/grid-column.viewmodel";
import { ShoppingCartViewModel } from "../viewmodels/shopping-cart-viewmodel";
import { CardContent, CardActions, Button } from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";

import "./shoppingcart.component.css";

const shoppingCartComponentState = new ShoppingCartComponentState();
type State = Readonly<typeof shoppingCartComponentState>;

interface IProps {}

type ShoppingCartComponentProps = IProps & RouteComponentProps;

class ShoppingCartComponent extends React.Component<
  ShoppingCartComponentProps
> {
  readonly state: State = shoppingCartComponentState;
  shoppingCartItems: Array<ShoppingCartViewModel>;
  gridColumns: Array<GridColumn>;
  counter: number;

  constructor(props: ShoppingCartComponentProps) {
    super(props);
    this.counter = 0;
    this.shoppingCartItems = new Array<ShoppingCartViewModel>();

    const existingShoppingCart = localStorage.getItem("ReactShoppingCart");

    let rowCounter: number = 0;
    if (existingShoppingCart !== null) {
      this.shoppingCartItems = JSON.parse(existingShoppingCart);
      this.shoppingCartItems.forEach(row => {
        rowCounter++;
        row.orderKey = rowCounter;
      });
    }

    this.gridColumns = [
      {
        name: "productNumber",
        description: "Product #",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: false,
        order: undefined,
        width: "100px",
        minWidth: "100px",
        mobileWidth: "100%",
        percentage: 10,
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "description",
        description: "Description",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: false,
        order: "asc",
        width: "300px",
        minWidth: "200px",
        mobileWidth: "100%",
        percentage: 25,
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "longDescription",
        description: "Summary",
        sortExpression: "",
        currentSort: false,
        active: false,
        numeric: false,
        order: undefined,
        width: "900px",
        minWidth: "100px",
        mobileWidth: "80%",
        percentage: 45,
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "unitPrice",
        description: "Unit Price",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: true,
        order: undefined,
        width: "100px",
        minWidth: "100px",
        mobileWidth: "100%",
        percentage: 10,
        alignment: "right",
        formatColumn: "currency",
        borderBreak: false,
        pointer: true
      },
      {
        name: "orderQuantity",
        description: "Order Quantity",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: true,
        order: undefined,
        width: "150px",
        minWidth: "150px",
        mobileWidth: "100%",
        percentage: 10,
        alignment: "right",
        formatColumn: "none",
        borderBreak: true,
        pointer: true
      }
    ];
  }

  handleCheckoutClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    this.props.history.push("/checkout");
  };

  handleEmptyCartClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    localStorage.removeItem("ReactShoppingCart");
    this.props.history.push("/productInquiry");
  };

  dummyFunction = (e: any) => {};

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Shopping Cart</div>
        <Card
          style={{
            marginLeft: "20px",
            marginRight: "20px"
          }}
        >
          <CardContent>
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
                <DataGridComponent
                  gridColumns={this.gridColumns}
                  gridRows={this.shoppingCartItems}
                  totalRows={this.shoppingCartItems.length}
                  resetCounter={this.state.counter}
                  uniqueRowKey="productId"
                  handlePagination={this.dummyFunction}
                  handleSort={this.dummyFunction}
                  handleRowSelection={this.dummyFunction}
                  scrollingHeight={300}
                  noDataFoundMessage="Your shopping cart is empty."
                />
              </Paper>
            </div>
          </CardContent>

          {this.shoppingCartItems.length > 0 && (
            <CardActions style={{ backgroundColor: "white" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleCheckoutClick}
              >
                Checkout
              </Button>

              <Button
                color="primary"
                variant="contained"
                onClick={this.handleEmptyCartClick}
              >
                Empty Cart
              </Button>
            </CardActions>
          )}
        </Card>
      </div>
    );
  }
}
export default ShoppingCartComponent;
