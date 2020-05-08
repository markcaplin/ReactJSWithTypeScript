export class UserInformationViewModel {
  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.addressLine1 = "";
    this.addressLine2 = "";
    this.city = "";
    this.state = "";
    this.zipCode = "";
    this.emailAddress = "";
    this.phoneNumber = "";
    this.lastLogin = new Date();
    this.isAuthenicated = false;
    this.authenicationCounter = 0;
  }
  public id: string;
  public firstName: string;
  public lastName: string;
  public addressLine1: string;
  public addressLine2: string;
  public city: string;
  public state: string;
  public zipCode: string;
  public emailAddress: string;
  public phoneNumber: string;
  public lastLogin: Date;
  public isAuthenicated: boolean;
  public authenicationCounter: number;
}
