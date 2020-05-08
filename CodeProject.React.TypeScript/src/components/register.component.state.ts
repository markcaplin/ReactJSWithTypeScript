export class RegisterComponentState {
  public emailAddress: string;
  public password: string;
  public passwordConfirmation: string;
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
  public emailAddressIsUnique: boolean;
  public emailAddressOnBlur: boolean;
  constructor() {
    this.emailAddress = "";
    this.password = "";
    this.passwordConfirmation = "";
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
    this.emailAddressIsUnique = false;
    this.emailAddressOnBlur = false;
  }
}
