import React from "react";
import httpService from "../services/http.service";
import DataGridComponent from "../shared/datagrid.component";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Paper from "@material-ui/core/Paper";

import { ProductInquiryComponentState } from "./productinquiry.component.state";
import { ProductInquiryViewModel } from "../viewmodels/product-inquiry.viewmodel";
import { ProductViewModel } from "../viewmodels/product.viewmodel";
import { ProductInquiryViewModelResponse } from "../viewmodels/product-inquiry-response.viewmodel";
import { amber, blue } from "@material-ui/core/colors";
import { FormControl } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { displayErrorMessage, displaySuccessMessage } from "../store/actions";

interface IProps {}

type ProductInquiryComponentProps = IProps & RouteComponentProps;

const productInquiryComponentState = new ProductInquiryComponentState();
type State = Readonly<typeof productInquiryComponentState>;

class ProductInquiryComponent extends React.Component<
  ProductInquiryComponentProps
> {
  readonly state: State = productInquiryComponentState;

  productNumberRef: any = React.createRef();
  descriptionRef: any = React.createRef();

  productInquiryViewModel: ProductInquiryComponentState;

  constructor(props: ProductInquiryComponentProps) {
    super(props);
    this.productInquiryViewModel = new ProductInquiryComponentState();
    this.productInquiryViewModel.references = [
      { propertyName: "productNumber", referenceField: this.productNumberRef },
      { propertyName: "description", referenceField: this.descriptionRef }
    ];

    this.productInquiryViewModel.gridColumns = [
      {
        name: "productNumber",
        description: "Product #",
        sortExpression: "ProductNumber",
        active: true,
        currentSort: false,
        numeric: false,
        order: undefined,
        width: "100px",
        minWidth: "100px",
        percentage: 10,
        mobileWidth: "100%",
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: true
      },
      {
        name: "description",
        description: "Description",
        sortExpression: "Description",
        active: true,
        currentSort: true,
        numeric: false,
        order: "asc",
        width: "300px",
        minWidth: "200px",
        percentage: 20,
        mobileWidth: "100%",
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: true
      },
      {
        name: "longDescription",
        description: "Summary",
        sortExpression: "",
        currentSort: false,
        active: false,
        numeric: false,
        order: undefined,
        width: "500px",
        minWidth: "100px",
        percentage: 50,
        mobileWidth: "80%",
        alignment: "left",
        formatColumn: "none",
        borderBreak: false,
        pointer: true
      },
      {
        name: "quantityOnHand",
        description: "On Hand Qty",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: true,
        order: undefined,
        width: "150px",
        minWidth: "100px",
        percentage: 10,
        mobileWidth: "100%",
        alignment: "right",
        formatColumn: "none",
        borderBreak: false,
        pointer: true
      },
      {
        name: "unitPrice",
        description: "Unit Price",
        sortExpression: "",
        active: false,
        currentSort: false,
        numeric: true,
        order: undefined,
        width: "150px",
        minWidth: "100px",
        percentage: 10,
        mobileWidth: "100%",
        alignment: "right",
        formatColumn: "currency",
        borderBreak: true,
        pointer: true
      }
    ];
  }

  componentDidMount() {
    this.setInitialValues();

    this.setState({ rowsPerPage: this.productInquiryViewModel.rowsPerPage });
    this.setState({
      currentPageNumber: this.productInquiryViewModel.currentPageNumber
    });
    this.setState({
      productNumber: this.productInquiryViewModel.productNumber
    });
    this.setState({ description: this.productInquiryViewModel.description });
    this.setState({
      sortExpression: this.productInquiryViewModel.sortExpression
    });
    this.setState({
      sortDirection: this.productInquiryViewModel.sortExpression
    });
    this.setState({ gridColumns: this.productInquiryViewModel.gridColumns });
    this.setState({ resetCounter: this.productInquiryViewModel.resetCounter });

    this.executeSearch(
      this.productInquiryViewModel.currentPageNumber,
      this.productInquiryViewModel.rowsPerPage
    );
  }

  setInitialValues = () => {
    this.productInquiryViewModel.rowsPerPage = 20;
    this.productInquiryViewModel.currentPageNumber = 0;
    this.productInquiryViewModel.productNumber = "";
    this.productInquiryViewModel.description = "";
    this.productInquiryViewModel.sortExpression = "Description";
    this.productInquiryViewModel.sortDirection = "asc";
    this.productInquiryViewModel.resetCounter = 0;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.productInquiryViewModel.currentPageNumber = 0;
    this.setState({
      currentPageNumber: this.productInquiryViewModel.currentPageNumber
    });
    this.executeSearch(
      this.productInquiryViewModel.currentPageNumber,
      this.productInquiryViewModel.rowsPerPage
    );
  };

  handleReset = () => {
    this.setInitialValues();
    this.productInquiryViewModel.resetCounter =
      this.productInquiryViewModel.resetCounter + 1;

    this.setState({ gridColumns: this.productInquiryViewModel.gridColumns });
    this.setState({ resetCounter: this.productInquiryViewModel.resetCounter });
    this.setState({
      productNumber: this.productInquiryViewModel.productNumber
    });
    this.setState({ description: this.productInquiryViewModel.description });
    this.setState({
      sortExpression: this.productInquiryViewModel.sortExpression
    });
    this.setState({
      sortDirection: this.productInquiryViewModel.sortExpression
    });

    this.executeSearch(
      this.productInquiryViewModel.currentPageNumber,
      this.productInquiryViewModel.rowsPerPage
    );
  };

  handleInputChange = (event: any) => {
    let targetName: string = event.target.name;
    this.setState({ [targetName]: event.target.value });
    let productInquiryViewModel: any = this.productInquiryViewModel;
    productInquiryViewModel[targetName] = event.target.value;
  };

  handlePagination = (newPageNumber: number) => {
    this.productInquiryViewModel.currentPageNumber = newPageNumber;
    this.setState({ currentPageNumber: newPageNumber });
    this.executeSearch(
      this.productInquiryViewModel.currentPageNumber,
      this.productInquiryViewModel.rowsPerPage
    );
  };

  handleRowSelection = (productId: any) => {
    this.props.history.push("/productdetail/" + productId);
  };

  handleSort = (sortExpression: string, sortDirection: string) => {
    this.productInquiryViewModel.sortExpression = sortExpression;
    this.productInquiryViewModel.sortDirection = sortDirection;
    this.productInquiryViewModel.currentPageNumber = 0;

    this.setState({ sortExpression: sortExpression });
    this.setState({ sortDirection: sortDirection });
    this.setState({
      currentPageNumber: this.productInquiryViewModel.currentPageNumber
    });

    this.executeSearch(
      this.productInquiryViewModel.currentPageNumber,
      this.productInquiryViewModel.rowsPerPage
    );
  };

  executeSearch(currentPageNumber: number, rowsPerPage: number) {
    let vm: any = this;

    let productInquiryViewModel = new ProductInquiryViewModel();
    productInquiryViewModel.productNumber = this.productInquiryViewModel.productNumber;
    productInquiryViewModel.description = this.productInquiryViewModel.description;
    productInquiryViewModel.currentPageNumber = currentPageNumber + 1;
    productInquiryViewModel.sortDirection = this.productInquiryViewModel.sortDirection;
    productInquiryViewModel.sortExpression = this.productInquiryViewModel.sortExpression;
    productInquiryViewModel.pageSize = rowsPerPage;
    productInquiryViewModel.products = new Array<ProductViewModel>();

    httpService
      .getProducts(productInquiryViewModel)
      .then(function(response: ProductInquiryViewModelResponse) {
        if (response.returnStatus === true) {
          vm.updateGrid(response);
        } else {
          vm.props.displayErrorMessage(response.returnMessage[0]);
        }
      });
  }

  updateGrid(response: ProductInquiryViewModelResponse) {
    this.setState({ products: response.entity });
    this.setState({ totalProducts: response.totalRows });
    this.setState({ totalPages: response.totalPages });
  }

  render() {
    return (
      <Card style={{ backgroundColor: blue[100] }}>
        <CardHeader
          title={"Product Inquiry "}
          style={{ margin: 5, padding: 5 }}
        />
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
              <ValidatorForm
                className="productInquirySearchForm"
                id="ProductSearchForm"
                debounceTime={1500}
                instantValidate={false}
                onSubmit={this.handleSubmit}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={6} xl={2} md={2} lg={2}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.productNumberRef}
                        label="Product #"
                        onChange={this.handleInputChange}
                        value={this.state.productNumber}
                        name="productNumber"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={6} xl={2} md={2} lg={2}>
                    <FormControl margin="normal" fullWidth>
                      <TextValidator
                        ref={this.descriptionRef}
                        label="Description"
                        onChange={this.handleInputChange}
                        value={this.state.description}
                        name="description"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={6} xl={1} md={1} lg={1}>
                    <FormControl margin="normal" fullWidth>
                      <Button
                        style={{
                          backgroundColor: blue[700],
                          color: "white"
                        }}
                        type="submit"
                        form="ProductSearchForm"
                      >
                        Search
                      </Button>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={6} xl={1} md={1} lg={1}>
                    <FormControl margin="normal" fullWidth>
                      <Button
                        onClick={this.handleReset}
                        style={{
                          backgroundColor: amber[700],
                          color: "white"
                        }}
                      >
                        Reset
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
              </ValidatorForm>

              <DataGridComponent
                gridColumns={this.productInquiryViewModel.gridColumns}
                gridRows={this.state.products}
                rowsPerPage={this.productInquiryViewModel.rowsPerPage}
                currentPageNumber={
                  this.productInquiryViewModel.currentPageNumber
                }
                totalRows={this.state.totalProducts}
                resultsTotalPages={this.state.totalPages}
                resetCounter={this.state.resetCounter}
                uniqueRowKey="productId"
                handlePagination={this.handlePagination}
                handleSort={this.handleSort}
                handleRowSelection={this.handleRowSelection}
                enablePagination={true}
                scrollingHeight={370}
                noDataFoundMessage="No Product Records found."
              />
            </Paper>
          </div>
        </CardContent>
        <div style={{ height: "30px", paddingLeft: "10px" }}>&nbsp;</div>
      </Card>
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
)(ProductInquiryComponent);
