import { ShoppingCartViewModel } from "../viewmodels/shopping-cart-viewmodel";

export class ShoppingCartComponentState {
  public shoppingCartItems: Array<ShoppingCartViewModel>;
  public counter: number;
  public constructor() {
    this.shoppingCartItems = new Array<ShoppingCartViewModel>();
    this.counter = 0;
  }
}
