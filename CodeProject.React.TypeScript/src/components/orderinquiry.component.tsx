import React from "react";
import DataGridComponent from "../shared/datagrid.component";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import httpService from "../services/http.service";

import { OrderInquiryComponentState } from "././orderinquiry.component.state";
import { GridColumn } from "../viewmodels/grid-column.viewmodel";
import { CardContent } from "@material-ui/core";
import { connect } from "react-redux";
import { displayErrorMessage, displaySuccessMessage } from "../store/actions";

const orderInquiryComponentState = new OrderInquiryComponentState();
type State = Readonly<typeof orderInquiryComponentState>;

interface IProps {}

class OrderInquiryComponent extends React.Component<IProps> {
  readonly state: State = orderInquiryComponentState;
  gridColumns: Array<GridColumn>;
  counter: number;

  constructor(props: IProps) {
    super(props);

    this.gridColumns = [
      {
        name: "orderNumber",
        description: "Order #",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: false,
        order: undefined,
        width: "100px",
        minWidth: "100px",
        mobileWidth: "100%",
        percentage: 5,
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "orderDate",
        description: "Ordered Date",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: false,
        order: "asc",
        width: "100px",
        minWidth: "100px",
        percentage: 10,
        mobileWidth: "100%",
        alignment: "left",
        formatColumn: "date",
        borderBreak: false,
        pointer: false
      },
      {
        name: "customerName",
        description: "Customer Name",
        sortExpression: "",
        currentSort: false,
        active: false,
        numeric: false,
        order: undefined,
        width: "200px",
        minWidth: "200px",
        percentage: 15,
        mobileWidth: "100%",
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "productNumber",
        description: "Product #",
        sortExpression: "",
        currentSort: false,
        active: false,
        numeric: false,
        order: undefined,
        width: "150px",
        minWidth: "150px",
        percentage: 10,
        mobileWidth: "100%",
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: false
      },
      {
        name: "description",
        description: "Description",
        sortExpression: "",
        currentSort: false,
        active: false,
        numeric: false,
        order: undefined,
        width: "250px",
        minWidth: "250px",
        percentage: 25,
        mobileWidth: "100%",
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
    this.counter = 0;
  }

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = () => {
    let thisComponent = this;
    httpService.getOrders().then(function(response: any) {
      if (response.returnStatus === true) {
        thisComponent.displayOrders(response);
      } else {
        thisComponent.displayServerError(response);
      }
    });
  };

  displayOrders = (response: any) => {
    this.counter = this.counter + 1;
    this.setState({ orders: response.entity });
    this.setState({ counter: this.counter });
  };

  displayServerError = (response: any) => {
    let thisComponent: any = this;
    thisComponent.props.displayErrorMessage(response.returnMessage[0]);
  };

  dummyFunction = (e: any) => {};

  render() {
    return (
      <div>
        <div style={{ margin: "10px", fontSize: "16pt" }}>Orders</div>
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
                  gridRows={this.state.orders}
                  totalRows={this.state.orders.length}
                  resetCounter={this.state.counter}
                  uniqueRowKey="orderKey"
                  handlePagination={this.dummyFunction}
                  handleSort={this.dummyFunction}
                  handleRowSelection={this.dummyFunction}
                  noDataFoundMessage="No orders found."
                  scrollingHeight={250}
                />
              </Paper>
            </div>
          </CardContent>
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
)(OrderInquiryComponent);
