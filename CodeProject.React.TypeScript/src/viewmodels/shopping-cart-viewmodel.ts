export class ShoppingCartViewModel {
  constructor() {
    this.orderKey = 0;
    this.productId = "";
    this.productNumber = "";
    this.description = "";
    this.longDescription = "";
    this.unitPrice = 0;
    this.orderQuantity = 0;
  }

  public orderKey: number;
  public productId: string;
  public productNumber: string;
  public description: string;
  public longDescription: string;
  public unitPrice: number;
  public orderQuantity: number;
}
