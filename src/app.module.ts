import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import * as config from '../ormconfig.js';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, CartModule, OrderModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
