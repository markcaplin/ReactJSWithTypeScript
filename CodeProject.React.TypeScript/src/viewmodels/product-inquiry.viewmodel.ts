
import { ProductViewModel } from "./product.viewmodel";

export class ProductInquiryViewModel {

  constructor() {
    this.productId = "";
    this.productNumber = "";
    this.description = "";
    this.currentPageNumber = 0;
    this.currentPageIndex = 0;
    this.pageSize = 0;
    this.sortDirection = "";
    this.sortExpression = "";
    this.totalPages = 0;
    this.totalProducts = 0;
    this.products = new Array<ProductViewModel>();
    this.displayedColumns = new Array<string>();
    this.pageSizeOptions = new Array<number>();
  }

  public productId: string;
  public productNumber: string;
  public description: string;
  public currentPageNumber: number;
  public currentPageIndex: number;
  public pageSize: number;
  public sortDirection: string;
  public sortExpression: string;
  public totalPages: number;
  public totalProducts: number;
  public products: Array<ProductViewModel>;
  public displayedColumns: Array<string>;
  public pageSizeOptions: Array<number>;

}
