import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import Product from './product.entity';
import ProductService from './product.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Product],
    }),
  ],
  providers: [ProductService],
})
export default class ProductModule {}
