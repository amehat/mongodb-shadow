import { Options } from '@mikro-orm/core';

import Product from './product.entity';

const config = {
  entities: [Product],
  clientUrl: 'mongodb://localhost:27017',
  dbName: 'mikro-orm-nest-ts',
  type: 'mongo',
} as Options;

export default config;
