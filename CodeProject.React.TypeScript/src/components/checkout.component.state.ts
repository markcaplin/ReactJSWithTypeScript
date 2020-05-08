export class CheckoutComponentState {
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
  public creditCardNumber: string;
  public nameOnCreditCard: string;
  public creditCardCVVNumber: string;
  public creditCardExpirationMonth: string;
  public creditCardExpirationYear: string;
  public creditCardTypeNotSelected: boolean;
  public creditCardType: string;
  public counter: number;

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
    this.creditCardNumber = "";
    this.nameOnCreditCard = "";
    this.creditCardCVVNumber = "";
    this.creditCardExpirationMonth = "";
    this.creditCardExpirationYear = "";
    this.creditCardTypeNotSelected = false;
    this.creditCardType = "";
    this.counter = 0;
  }
}
