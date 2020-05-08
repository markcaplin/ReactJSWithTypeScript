import { OrderInquiryViewModel } from "../viewmodels/order-inquiry.viewmodel";

export class OrderInquiryComponentState {
  public orders: Array<OrderInquiryViewModel>;
  public counter: number;
  public constructor() {
    this.orders = new Array<OrderInquiryViewModel>();
    this.counter = 0;
  }
}
