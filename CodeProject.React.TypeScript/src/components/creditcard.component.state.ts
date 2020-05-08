export class CreditCardComponentState {
  public creditCardNumber: string;
  public creditCardNumberFocused: boolean;
  public nameOnCreditCard: string;
  public creditCardType: string;
  public creditCardCVVNumber: string;
  public creditCardCVVNumberFocused: boolean;
  public creditCardExpirationMonth: string;
  public creditCardExpirationYear: string;
  public creditCardExpirationMonthFocused: boolean;
  public creditCardExpirationYearFocused: boolean;
  public creditCardNumberPlaceholder: string;
  public creditCardCVVNumberPlaceholder: string;
  public creditCardTypeNotSelected: boolean;
  public counter: number;

  constructor() {
    this.creditCardNumber = "";
    this.nameOnCreditCard = "";
    this.creditCardCVVNumber = "";
    this.creditCardExpirationMonth = "";
    this.creditCardExpirationYear = "";
    this.creditCardNumberFocused = false;
    this.creditCardCVVNumberFocused = false;
    this.creditCardExpirationMonthFocused = false;
    this.creditCardExpirationYearFocused = false;
    this.creditCardNumberPlaceholder = "";
    this.creditCardType = "";
    this.creditCardCVVNumberPlaceholder = "";
    this.creditCardTypeNotSelected = false;
    this.counter = -1;
  }
}
