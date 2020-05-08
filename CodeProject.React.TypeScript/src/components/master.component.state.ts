import { UserInformationViewModel } from "../viewmodels/user-information.viewmodel";
import { MenuItem } from "../viewmodels/menu.viewmodel";

export class MasterComponentState extends UserInformationViewModel {
  public processing: boolean;
  public authenicationCounter: number;
  public openDrawer: boolean;
  public menuItems: Array<MenuItem>;
  constructor() {
    super();
    this.processing = false;
    this.authenicationCounter = 0;
    this.openDrawer = false;
    this.menuItems = new Array<MenuItem>();
  }
}
