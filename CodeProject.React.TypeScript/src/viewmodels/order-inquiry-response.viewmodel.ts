import { ResponseModel } from "./response.model";
import { OrderInquiryViewModel } from "./order-inquiry.viewmodel";

export class OrderInquiryViewModelResponse extends ResponseModel {
  constructor() {
    super();
    this.entity = new Array<OrderInquiryViewModel>();
  }

  public entity: Array<OrderInquiryViewModel>;
}
