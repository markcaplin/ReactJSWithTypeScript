import { GridColumn } from "../viewmodels/grid-column.viewmodel";

export class DataGridComponentState {
  public productNumber: string;
  public description: string;

  public currentPageIndex: number;
  public sortDirection: string;
  public sortExpression: string;
  public noDataFoundMessage: string;

  public resultsTotalPages: number;
  public emptyRows: number;
  public width: number;
  public height: number;

  public gridColumns: Array<GridColumn>;
  public originalGridColumns: Array<GridColumn>;
  public gridRows: Array<any>;
  public uniqueRowKey: string;
  public totalRows: number;
  public rowsPerPage: number;
  public currentPageNumber: number;
  public scrollingHeight: string;
  public isMobile: boolean;
  public resetCounter: number;
  public widthTest: string;

  constructor() {
    this.productNumber = "";
    this.description = "";
    this.currentPageIndex = 0;
    this.currentPageNumber = 0;
    this.sortDirection = "";
    this.sortExpression = "";
    this.noDataFoundMessage = "";
    this.rowsPerPage = 0;
    this.resultsTotalPages = 0;
    this.emptyRows = 0;
    this.width = 0;
    this.height = 0;
    this.resetCounter = 0;

    this.isMobile = false;
    this.gridColumns = new Array<GridColumn>();
    this.originalGridColumns = new Array<GridColumn>();
    this.gridRows = new Array<any>();
    this.uniqueRowKey = "";
    this.totalRows = 0;
    this.rowsPerPage = 0;
    this.currentPageNumber = 0;
    this.scrollingHeight = "";
    this.widthTest = "";
  }
}
