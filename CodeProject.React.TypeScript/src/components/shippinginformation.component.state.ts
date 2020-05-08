export class ShippingInformationComponentState {
  public firstName: string;
  public lastName: string;
  public addressLine1: string;
  public addressLine2: string;
  public city: string;
  public state: string;
  public zipCode: string;
  public zipCodeFocused: boolean;
  public phoneNumber: string;
  public phoneNumberFocused: boolean;

  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.addressLine1 = "";
    this.addressLine2 = "";
    this.city = "";
    this.state = "";
    this.zipCode = "";
    this.zipCodeFocused = false;
    this.phoneNumber = "";
    this.phoneNumberFocused = false;
  }
}
