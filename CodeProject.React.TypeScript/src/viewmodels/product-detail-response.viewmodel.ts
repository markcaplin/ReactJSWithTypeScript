
import { ResponseModel } from "./response.model";
import { ProductViewModel } from "./product.viewmodel";

export class ProductDetailViewModelResponse extends ResponseModel {

  constructor() {
    super();
    this.entity = new ProductViewModel();
  }

  public entity: ProductViewModel;

}
