type ScrapItem = {
  name: string;
  units: number;
  price: number;
};

export type IScrapData = {
  items: [ScrapItem];
  name: string;
  date: string;
  totalPrice: string;
};

export type IItem = {
  name: string;
  units: number;
  price: number;
  profitMargin: number;
  applyDiscounts: boolean;
  discount: number;
  discountPerc: number;
};

export type IScanData = {
  items: [IItem];
  name: string;
  date: string;
  totalPrice: string;
};
