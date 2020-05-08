import { amber, green, red, blue } from "@material-ui/core/colors";

import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export class AlertComponentState {
  public openAlertMessage: boolean;
  public messageToDisplay: string;
  public variant: string;
  public className: string;
  public errorBackgroundColor: string;
  public successBackgroundColor: string;
  public infoBackgroundColor: string;
  public warningBackgroundColor: string;
  public backgroundColor: string;
  public icon: any;
  public successIcon: any;
  public warningIcon: any;
  public errorIcon: any;
  public infoIcon: any;
  public initialLoad: boolean;
  public messageCounter: number;
  constructor() {
    this.openAlertMessage = false;
    this.messageToDisplay = "";
    this.variant = "";
    this.className = "";
    this.errorBackgroundColor = red[700];
    this.infoBackgroundColor = blue[700];
    this.warningBackgroundColor = amber[700];
    this.successBackgroundColor = green[600];
    this.successIcon = CheckCircleIcon;
    this.warningIcon = WarningIcon;
    this.errorIcon = ErrorIcon;
    this.infoIcon = InfoIcon;
    this.icon = {};

    this.backgroundColor = "";
    this.initialLoad = true;
    this.messageCounter = 0;
  }
}
