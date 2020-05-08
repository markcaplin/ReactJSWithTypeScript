import ReferenceField from "../shared/reference-fields";

import { ProductViewModel } from "../viewmodels/product.viewmodel";
import { GridColumn } from "../viewmodels/grid-column.viewmodel";

export class ProductInquiryComponentState {
  public productNumber: string;
  public description: string;
  public currentPageNumber: number;
  public currentPageIndex: number;
  public sortDirection: string;
  public sortExpression: string;
  public products: Array<ProductViewModel>;
  public displayNoDataMessage: boolean;
  public rowsPerPage: number;
  public totalProducts: number;
  public totalPages: number;
  public emptyRows: number;
  public width: number;
  public height: number;
  public resetCounter: number;
  public gridColumns: Array<GridColumn>;
  public references: Array<ReferenceField>;

  constructor() {
    this.productNumber = "";
    this.description = "";
    this.currentPageIndex = 0;
    this.currentPageNumber = 0;
    this.sortDirection = "";
    this.sortExpression = "";
    this.displayNoDataMessage = false;
    this.rowsPerPage = 0;
    this.totalProducts = 0;
    this.totalPages = 0;
    this.emptyRows = 0;
    this.width = 0;
    this.height = 0;
    this.resetCounter = 0;
    this.products = new Array<ProductViewModel>();
    this.gridColumns = new Array<GridColumn>();
    this.references = new Array<ReferenceField>();
  }
}
