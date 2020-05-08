import { ProductViewModel } from "../viewmodels/product.viewmodel";

export class ProductDetailComponentState {
  constructor() {
    this.productId = "";
    this.orderQuantity = 1;
    this.orderQuantityFocused = false;
    this.product = new ProductViewModel();
  }
  public productId: string;
  public orderQuantity: number;
  public orderQuantityFocused: boolean;
  public product: ProductViewModel;
}
