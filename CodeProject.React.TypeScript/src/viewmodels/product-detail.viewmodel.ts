import { ProductViewModel } from "./product.viewmodel";

export class ProductDetailViewModel {

  constructor() {
    this.productNumber = "";
    this.orderQuantity = 0;
    this.product = new ProductViewModel();
  }

  public productNumber: string;
  public orderQuantity: number;
  public product: ProductViewModel;

}
