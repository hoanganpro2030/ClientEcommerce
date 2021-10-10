import {Injectable} from "@angular/core";
import {SingleCart} from '../model/single-cart.model';

@Injectable()
export class ShoppingCartService {
  private _productCarts: SingleCart[] = [];
  private _totalPrice: number;

  get totalPrice(): number {
    return this._totalPrice;
  }

  set totalPrice(value: number) {
    this._totalPrice = value;
  }

  get productCarts(): SingleCart[] {
    return this._productCarts;
  }

  set productCarts(value: SingleCart[]) {
    this._productCarts = value;
  }

  updateTotalPrice() {
    this.totalPrice = 0;
    this.productCarts.forEach(pd => {
      this.totalPrice += pd.quantity * pd.product.price;
    });
    localStorage.setItem('productCarts', JSON.stringify(this._productCarts));
  }

  deleteProducts(id: number) {
    let index = this._productCarts.findIndex(p => p.product.id === id);
    this._productCarts.splice(index, 1);
    this.updateTotalPrice();
  }

  deleteMultiProducts(ids: number[]) {
    for (let id of ids) {
      this.deleteProducts(id);
    }
    this.updateTotalPrice();
  }

  findProductById(id: number): SingleCart {
    return this._productCarts.find((p) => p.product.id === id);
  }

  insertProduct(productCart: SingleCart) {
    let existedCart = this.productCarts.find(p => p.product.id === productCart.product.id);
    if (existedCart) {
      existedCart.quantity += productCart.quantity;
    } else {
      this.productCarts.push(productCart);
    }
    this.updateTotalPrice();
  }

  clearCart(): void {
    this.productCarts = [];
    this.totalPrice = 0;
    localStorage.removeItem('productCarts');
  }
}
