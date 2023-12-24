export enum CartStatuses {
  OPEN = 'OPEN',
  STATUS = 'STATUS'
}

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItemType = {
  product: Product,
  count: number,
}

export type CartType = {
  id: string,
  user_id: string,
  created_at: Date,
  updated_at: Date,
  status: CartStatuses,
  items: CartItemType[],
}
