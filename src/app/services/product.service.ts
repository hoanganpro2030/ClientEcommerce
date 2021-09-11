import {Injectable} from '@angular/core';
import {Product} from '../model/product.model';

@Injectable()
export class ProductService {
  private _products: Product[] = [];
  private _bagProduct : Product[][] = [];

  get bagProduct(): Product[][] {
    return this._bagProduct;
  }

  set bagProduct(value: Product[][]) {
    this._bagProduct = value;
  }

  get products(): Product[] {
    return this._products;
  }

  set products(value: Product[]) {
    this._products = value;
  }

  deleteProducts(id: number) {
    let index = this._products.findIndex(p => p.id === id);
    this._products.splice(index, 1);
  }

  findProductById(id: number): Product {
    return this._products.find((p) => p.id === id);
  }

  insertProduct(product: Product) {
    this._products.push(product);
  }
}
