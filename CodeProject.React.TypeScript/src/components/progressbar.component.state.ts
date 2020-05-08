export class ProgressBarComponentState {
  public processing: boolean;
  public initialLoad: boolean;
  constructor() {
    this.processing = false;
    this.initialLoad = true;
  }
}
