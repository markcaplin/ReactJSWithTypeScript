
import { OrderDetailViewModel } from "./order-detail.viewmodel";

export class OrderViewModel {

  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.addressLine1 = "";
    this.addressLine2 = "";
    this.city = "";
    this.state = "";
    this.zipCode = "";
    this.emailAddress = "";
    this.creditCardNumber = "";
    this.orderDetails = new Array<OrderDetailViewModel>();
  }

  public firstName: string;
  public lastName: string;
  public addressLine1: string;
  public addressLine2: string;
  public city: string;
  public state: string;
  public zipCode: string;
  public emailAddress: string;
  public creditCardNumber: string;
  public orderDetails: Array<OrderDetailViewModel>;
}
