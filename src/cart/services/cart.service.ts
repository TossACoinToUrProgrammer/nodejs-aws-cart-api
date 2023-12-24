import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CartStatuses, CartType } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart as CartEntity } from '../cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../cart-item.entity';

@Injectable()
export class CartService {
  private userCarts: Record<string, CartType> = {};

  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartType>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<CartType> {
    if (!userId) return;
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.user_id = :userId', { userId })
      .leftJoinAndSelect('cart.items', 'items')
      .getOne();
    return cart;
  }

  createByUserId(userId: string) {
    console.log('created');
    const userCart = {
      user_id: userId,
      items: [],
      status: CartStatuses.OPEN,
    };

    const newCart = this.cartRepository.create(userCart);
    return this.cartRepository.save(newCart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartType> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      const mappedItems = userCart.items.map((item) => ({
        ...item,
        product: {
          //@ts-ignore
          id: item.product_id,
          title: 'test product',
          description: 'test descroption',
          price: 110,
        },
      }));
      return { ...userCart, items: mappedItems };
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: CartType): Promise<CartType> {
    const cart = await this.findOrCreateByUserId(userId);

    for (const item of items) {
      const cartItem = new CartItem();
      //@ts-ignore
      cartItem.cart = cart;
      //@ts-ignore
      cartItem.product_id = item.product_id;
      cartItem.count = item.count;

      await this.cartItemRepository.save(cartItem);
    }

    const updatedCart = await this.cartRepository.findOne({
      relations: ['items'],
      where: { id: cart.id },
    });
    
    console.log('updatedCart', updatedCart);

    const mappedItems = updatedCart.items.map((item) => ({
      ...item,
      product: {
        //@ts-ignore
        id: item.product_id,
        title: 'test product',
        description: 'test descroption',
        price: 110,
      },
    }));

    return { ...updatedCart, items: mappedItems };
  }

  async removeByUserId(userId) {
    const cart = await this.findOrCreateByUserId(userId);
    await this.cartRepository.remove(cart);
  }
}
