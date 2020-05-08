export class ProductViewModel {
  constructor() {
    this.productId = "";
    this.productNumber = "";
    this.description = "";
    this.longDescription = "";
    this.unitPrice = 0.0;
    this.onHandQuantity = 0;
    this.quantityOnHand = 0;
  }

  public productId: string;
  public productNumber: string;
  public description: string;
  public longDescription: string;
  public unitPrice: number;
  public onHandQuantity: number;
  public quantityOnHand: number;
}
