import { CartType, CartItemType } from '../models';

/**
 * @param {CartType} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: CartType): number {
  return cart ? cart.items.reduce((acc: number, { product: { price }, count }: CartItemType) => {
    return acc += price * count;
  }, 0) : 0;
}
