export type Order = "asc" | "desc" | undefined;
export type TextAlignment = "left" | "right";
export type FormatColumn = "none" | "currency" | "date";
export class GridColumn {
  constructor() {
    this.name = "";
    this.description = "";
    this.sortExpression = "";
    this.active = false;
    this.currentSort = false;
    this.numeric = false;
    this.order = undefined;
    this.width = "";
    this.percentage = 0;
    this.minWidth = "";
    this.mobileWidth = "";
    this.alignment = "left";
    this.formatColumn = "none";
    this.borderBreak = false;
    this.pointer = false;
  }

  public name: any;
  public description: string;
  public sortExpression: string;
  public active: boolean;
  public currentSort: boolean;
  public numeric: boolean;
  public order: Order;
  public width: string;
  public percentage: number;
  public minWidth: string;
  public mobileWidth: string;
  public alignment: TextAlignment;
  public formatColumn: FormatColumn;
  public borderBreak: boolean;
  public pointer: boolean;
  
}
