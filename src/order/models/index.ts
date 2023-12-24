import { CartItemType } from '../../cart/models';

export type Order = {
  id?: string,
  userId: string;
  cartId: string;
  items: CartItemType[]
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  },
  delivery: {
    type: string,
    address: any,
  },
  comments: string,
  status: string;
  total: number;
}
