import {Product} from './product.model';

export interface SingleCart {
  quantity: number;
  product: Product;
  isCheck: boolean;
}
