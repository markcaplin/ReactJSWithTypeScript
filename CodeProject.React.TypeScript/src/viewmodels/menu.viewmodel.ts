export class MenuItem {
  public text: string;
  public route: string;
  public display: boolean;
  public requiresAuthenication: boolean;
  public alwaysShow: boolean;
  constructor() {
    this.text = "";
    this.route = "";
    this.display = false;
    this.requiresAuthenication = false;
    this.alwaysShow = false;
  }
}
