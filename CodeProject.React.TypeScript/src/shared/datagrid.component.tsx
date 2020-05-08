import React from "react";
import NumberFormat from "react-number-format";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import Moment from "react-moment";

import { DataGridComponentState } from "./datagrid.component.state";
import { GridColumn, Order } from "../viewmodels/grid-column.viewmodel";
import { TableSortLabel, IconButton } from "@material-ui/core";

import "./datagrid.component.css";

interface IProps {
  gridColumns: Array<GridColumn>;
  gridRows: Array<any>;
  uniqueRowKey: string;
  totalRows: number;
  resultsTotalPages: number;
  resetCounter: number;
  rowsPerPage: number;
  currentPageNumber: number;
  handlePagination: any;
  handleSort: any;
  handleRowSelection: any;
  enablePagination: boolean;
  noDataFoundMessage: string;
  scrollingHeight: number;
}

const dataGridComponentState = new DataGridComponentState();
type State = Readonly<typeof dataGridComponentState>;

class DataGridComponent extends React.Component<IProps> {
  readonly state: State = dataGridComponentState;
  tableBodyRef: any = React.createRef();
  static defaultProps = {
    enablePagination: false,
    rowsPerPage: 1,
    currentPageNumber: 1,
    resultsTotalPages: 1
  };

  componentDidMount() {
    const gridColumns: Array<GridColumn> = this.getGridColumns(
      this.props.gridColumns
    );
    this.setState({ originalGridColumns: gridColumns });
    this.setState({ resultsTotalPages: this.props.resultsTotalPages });
    this.setState({ currentPageNumber: this.props.currentPageNumber });
    this.setState({ gridRows: this.props.gridRows });
    this.setState({ noDataFoundMessage: this.props.noDataFoundMessage });
    this.setState({ resetCounter: 0 });

    window.addEventListener("resize", this.updateWindowDimensions);

    setTimeout(() => {
      this.updateWindowDimensions();
    }, 1000);
  }

  componentDidUpdate = () => {
    this.handleScroll();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  componentWillReceiveProps = (props: IProps) => {
    this.setState({ gridRows: this.props.gridRows });
    this.setState({ uniqueRowKey: this.props.uniqueRowKey });
    this.setState({ totalRows: this.props.totalRows });
    this.setState({ resultsTotalPages: this.props.resultsTotalPages });
    this.setState({ rowsPerPage: this.props.rowsPerPage });
    this.setState({ currentPageNumber: this.props.currentPageNumber });
    this.setState({ noDataFoundMessage: this.props.noDataFoundMessage });

    if (this.state.resetCounter !== this.props.resetCounter) {
      this.setState({ resetCounter: this.props.resetCounter });
      this.resetDefaultSort();
    }
  };

  resetDefaultSort = () => {
    let gridColumns = this.getGridColumns(this.state.gridColumns);
    gridColumns.forEach(column => {
      let originalGridColumn = this.state.originalGridColumns.find(
        x => x.name === column.name
      );
      if (originalGridColumn !== undefined && originalGridColumn !== null) {
        column.currentSort = originalGridColumn.currentSort;
        column.order = originalGridColumn.order;
      }
    });
    this.setState({ gridColumns: gridColumns });
  };

  updateColumnWidths = (
    resolutionWidth: number,
    resolutionHeight: number,
    isMobile: boolean
  ) => {
    let gridColumns: Array<GridColumn> = this.getGridColumns(
      this.state.originalGridColumns
    );

    for (let i = 0; i < gridColumns.length; i++) {
      let percentage: number = gridColumns[i].percentage / 100;

      let newWidth = Math.round((window.innerWidth - 350) * percentage);

      gridColumns[i].width = newWidth.toString() + "px";
    }

    if (isMobile) {
      for (let i = 0; i < gridColumns.length; i++) {
        gridColumns[i].width = "100%";
        gridColumns[i].alignment = "left";
      }
    }

    this.setState({ gridColumns: gridColumns });
  };

  getGridColumns = (sourcecolumns: Array<GridColumn>) => {
    let gridColumns = new Array<GridColumn>();
    for (let i = 0; i < sourcecolumns.length; i++) {
      let gridColumn = new GridColumn();
      gridColumn.name = sourcecolumns[i].name;
      gridColumn.description = sourcecolumns[i].description;
      gridColumn.active = sourcecolumns[i].active;
      gridColumn.currentSort = sourcecolumns[i].currentSort;
      gridColumn.order = sourcecolumns[i].order;
      gridColumn.sortExpression = sourcecolumns[i].sortExpression;
      gridColumn.numeric = sourcecolumns[i].numeric;
      gridColumn.width = sourcecolumns[i].width;
      gridColumn.minWidth = sourcecolumns[i].minWidth;
      gridColumn.mobileWidth = sourcecolumns[i].mobileWidth;
      gridColumn.percentage = sourcecolumns[i].percentage;
      gridColumn.alignment = sourcecolumns[i].alignment;
      gridColumn.formatColumn = sourcecolumns[i].formatColumn;
      gridColumn.borderBreak = sourcecolumns[i].borderBreak;
      gridColumn.pointer = sourcecolumns[i].pointer;
      gridColumns.push(gridColumn);
    }
    return gridColumns;
  };

  updateWindowDimensions = () => {
    let element: any = document.getElementById("DataGridTableHeader");
    let isMobile = false;
    if (element !== undefined && element !== null) {
      if (element.offsetParent === null) {
        isMobile = true;
      }
    }

    let width = window.screen.width * window.devicePixelRatio;
    let height = window.screen.height * window.devicePixelRatio;

    this.setState({ isMobile: isMobile });
    this.setState({ width: window.innerWidth, height: window.innerHeight });

    setTimeout(() => {
      this.setScrollingHeight(width, height);
      this.updateColumnWidths(width, height, isMobile);
    }, 1000);
  };

  setScrollingHeight = (width: number, height: number) => {
    let diff = height - window.innerHeight;

    if (width === 2112 && height === 1188) {
      let gridHeight = window.innerHeight - this.props.scrollingHeight;

      this.setState({ scrollingHeight: gridHeight });

      return;
    }

    if (width === 1920 && height === 1080) {
    
      let gridHeight = window.innerHeight - this.props.scrollingHeight - 20;

      this.setState({ scrollingHeight: gridHeight });

      return;
    }

    if (width === 1280 && height === 720) {
      // 16:9	0.9%	720p TV

      let heightDiff = 200;
      let gridHeight = heightDiff + "px";

      this.setState({ scrollingHeight: gridHeight });

      return;
    }

    if (width === 3840 && height === 2160) {
      diff = window.screen.height - window.innerHeight;
      let heightDiff = 346 - diff;
      let gridHeight = heightDiff + "px";

      this.setState({ scrollingHeight: gridHeight });

      return;
    }

    diff = window.screen.height - window.innerHeight;
    let newGridHeight = diff + "px";
    this.setState({ scrollingHeight: newGridHeight });
  };

  handleScroll = () => {
    setTimeout(() => {
      if (this.tableBodyRef !== undefined && this.tableBodyRef !== null) {
        try {
          this.tableBodyRef.current.scrollIntoView({ behavior: "auto" });
        } catch (exception) {}

        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 2000);
      }
    }, 500);
  };

  handleDataGridPagination = (newPageNumber: number) => {
    this.props.handlePagination(newPageNumber);
  };

  handleRowSelection = (event: any, id: any) => {
    this.props.handleRowSelection(id);
  };

  onSortClick = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
    let sortExpression: any = "";

    for (let i = 0; i < this.state.gridColumns.length; i++) {
      if (this.state.gridColumns[i].name === property) {
        sortExpression = this.state.gridColumns[i].sortExpression;
        break;
      }
    }

    const isDesc =
      this.state.sortExpression === sortExpression &&
      this.state.sortDirection === "desc";

    const sortDirection: Order = isDesc ? "asc" : "desc";

    let gridColumns: Array<GridColumn> = this.getGridColumns(
      this.state.gridColumns
    );

    for (let i = 0; i < gridColumns.length; i++) {
      if (gridColumns[i].name === property) {
        gridColumns[i].order = sortDirection;
        gridColumns[i].currentSort = true;
        sortExpression = gridColumns[i].sortExpression;
      } else {
        gridColumns[i].currentSort = false;
      }
    }

    this.setState({ gridColumns: gridColumns });
    this.setState({ sortExpression: sortExpression });
    this.setState({ sortDirection: sortDirection });
    this.setState({ currentPageNumber: 0 });

    this.props.handleSort(sortExpression, sortDirection);
  };

  handleChangePage = (event: any, newPage: number) => {};

  handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let currentPageNumber = this.state.currentPageNumber + 1;
    this.handleDataGridPagination(currentPageNumber);
  };

  handlePrevButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let currentPageNumber = this.state.currentPageNumber - 1;
    this.handleDataGridPagination(currentPageNumber);
  };

  handleFirstButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let currentPageNumber = 0;
    this.handleDataGridPagination(currentPageNumber);
  };

  handleLastButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let currentPageNumber = Math.max(
      0,
      Math.ceil(this.state.totalRows / this.state.rowsPerPage) - 1
    );
    this.handleDataGridPagination(currentPageNumber);
  };

  getPaginationActionsTemplate = () => {
    return (
      <React.Fragment>
        <IconButton
          disabled={this.state.currentPageNumber === 0}
          onClick={this.handleFirstButtonClick}
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          disabled={this.state.currentPageNumber === 0}
          onClick={this.handlePrevButtonClick}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          disabled={
            this.state.currentPageNumber >=
            Math.ceil(this.state.totalRows / this.state.rowsPerPage) - 1
          }
          onClick={this.handleNextButtonClick}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          disabled={
            this.state.currentPageNumber >=
            Math.ceil(this.state.totalRows / this.state.rowsPerPage) - 1
          }
          onClick={this.handleLastButtonClick}
        >
          <LastPageIcon />
        </IconButton>
      </React.Fragment>
    );
  };

  render() {
    let tableBodyStyle = {};
    if (this.state.isMobile === true) {
      tableBodyStyle = {
        height: "100%",
        width: "95%"
      };
    } else {
      tableBodyStyle = {
        height: this.state.scrollingHeight,
        overflow: "auto"
      };
    }

    return (
      <div>
        <div className="dataGridTableWrapper">
          {this.state.gridRows.length > 0 && (
            <Table id="DataGridTableHeader" className="dataGridTableHeader">
              <TableHead>
                <TableRow className="dataGridTableRow">
                  {this.state.gridColumns.map((column, index) => (
                    <TableCell
                      key={column.name}
                      style={{
                        width: column.width,
                        textAlign: column.alignment
                      }}
                    >
                      {column.currentSort === true && (
                        <TableSortLabel
                          active={column.active}
                          direction={column.order}
                          onClick={this.onSortClick(column.name)}
                        />
                      )}

                      {column.active === true && (
                        <span
                          onClick={this.onSortClick(column.name)}
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer"
                          }}
                        >
                          {column.description}
                        </span>
                      )}

                      {column.active === false && (
                        <span>{column.description}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            </Table>
          )}
          <div style={tableBodyStyle}>
            <Table className="dataGridTableContainer">
              <TableBody ref={this.tableBodyRef}>
                {this.state.gridRows.map(row => (
                  <TableRow
                    hover
                    onClick={event =>
                      this.handleRowSelection(
                        event,
                        row[this.state.uniqueRowKey]
                      )
                    }
                    className="dataGridTableRow"
                    key={row[this.state.uniqueRowKey]}
                  >
                    {this.state.gridColumns.map(column => (
                      <TableCell
                        key={column.name}
                        style={{
                          overflowWrap: "break-word",
                          width: column.width,
                          textAlign: column.alignment,
                          paddingRight:
                            this.state.isMobile === true &&
                            column.borderBreak === true
                              ? "40px"
                              : "",
                          borderBottomColor:
                            this.state.isMobile === true &&
                            column.borderBreak === true
                              ? "black"
                              : ""
                        }}
                      >
                        {this.state.isMobile === true && (
                          <span
                            style={{
                              cursor: column.pointer === true ? "pointer" : ""
                            }}
                          >
                            <span className="dataGridMobileText">
                              {column.description}:&nbsp;
                            </span>
                          </span>
                        )}

                        {column.formatColumn === "none" && (
                          <span
                            style={{
                              cursor: column.pointer === true ? "pointer" : ""
                            }}
                          >
                            {row[column.name]}
                          </span>
                        )}

                        {column.formatColumn === "currency" && (
                          <span
                            style={{
                              cursor: column.pointer === true ? "pointer" : ""
                            }}
                          >
                            <NumberFormat
                              value={row[column.name]}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale={true}
                              prefix={"$"}
                            />
                          </span>
                        )}

                        {column.formatColumn === "date" && (
                          <span
                            style={{
                              cursor: column.pointer === true ? "pointer" : ""
                            }}
                          >
                            <Moment format="MM/DD/YYYY">
                              {row[column.name]}
                            </Moment>
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {this.state.gridRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="noDataFound">
                      <Typography variant="h6">
                        <ErrorIcon
                          style={{
                            fontSize: 16,
                            verticalAlign: "middle",
                            opacity: 0.9,
                            marginRight: 8
                          }}
                        />
                        <span
                          style={{
                            fontSize: 14,
                            verticalAlign: "middle"
                          }}
                        >
                          {this.state.noDataFoundMessage}
                        </span>
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {this.props.enablePagination === true && (
            <Table>
              <TableFooter>
                <TableRow className="dataGridPager">
                  <TablePagination
                    colSpan={4}
                    labelRowsPerPage=""
                    onChangePage={this.handleChangePage}
                    rowsPerPageOptions={[]}
                    count={this.state.totalRows}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPageNumber}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true
                    }}
                    ActionsComponent={this.getPaginationActionsTemplate}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </div>
      </div>
    );
  }
}

export default DataGridComponent;
