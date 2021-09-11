import {Injectable} from '@angular/core';
import {ProductCriteria} from '../model/product-criteria.model';

@Injectable()
export class ProductSearchService {
  private _criteria: ProductCriteria = {
    id: null,
    name: '',
    price: null,
    productType: '-1',
    description: null,
    quantity: null,
    dateStockIn: null
  };

  get criteria(): ProductCriteria {
    return this._criteria;
  }

  set criteria(value: ProductCriteria) {
    this._criteria = value;
  }
}
