export class OrderInquiryViewModel {
  constructor() {
    this.customerName = "";
    this.orderDate = new Date();
    this.productNumber = "";
    this.description = "";
    this.unitPrice = 0.0;
    this.orderQuantity = 0;
    this.orderKey = 0;
  }

  public orderKey: number;
  public customerName: string;
  public orderDate: Date;
  public productNumber: string;
  public description: string;
  public unitPrice: number;
  public orderQuantity: number;
}
