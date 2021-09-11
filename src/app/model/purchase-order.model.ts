import {ProductsOrder} from './products-order.model';
import {StatusOrder} from '../enum/status-order';

export interface PurchaseOrder {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressDetail: string;
  province: string;
  district: string;
  ward: string;
  note: string;
  totalPrice: number;
  detail: string;
  orderDate: string;
  status: StatusOrder;
  version: number;
}
