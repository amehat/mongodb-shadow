import { Module } from '@nestjs/common';

import MongoDB from './mongodb/mongodb.service';
import Store from './store';

@Module({
  providers: [MongoDB, Store],
  exports: [MongoDB],
})
export default class MongoDBShadowModule {}
