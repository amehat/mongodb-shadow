import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import AppController from './app.controller';
import AppService from './app.service';
import Product from './product.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [Product],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
