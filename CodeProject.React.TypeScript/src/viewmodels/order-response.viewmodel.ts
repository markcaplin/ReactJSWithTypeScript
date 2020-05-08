
import { ResponseModel } from "./response.model";
import { OrderViewModel } from "./order.viewmodel";

export class OrderViewModelResponse extends ResponseModel {

  constructor() {
    super();
    this.entity = new OrderViewModel();
  }

  public entity: OrderViewModel;

}
