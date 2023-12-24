// src/entities/cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'date',
    default: () => 'CURRENT_DATE',
    onUpdate: 'CURRENT_DATE',
  })
  updated_at: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'] })
  status: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}
