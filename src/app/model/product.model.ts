export enum ProductType {
  FASHION = 'Fashion',
  FOOD = 'Food',
  ELEC = 'Electronic',
  CONVE = 'Convenient',
  TECH = 'Technical',
  DRINK = 'Drink'
}

export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  dateStockIn: string;
  version: number;
  productType: ProductType;
}
