export class OrderDetailViewModel {

  constructor() {
    this.productId = "";
    this.productNumber = "";
    this.description = "";
    this.unitPrice = 0.0;
    this.orderQuantity = 0;
  }

  public productId: string;
  public productNumber: string;
  public description: string;
  public unitPrice: number;
  public orderQuantity: number;

}
