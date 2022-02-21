import { EntityRepository, Repository } from '@mikro-orm/core';
import Product from './product.entity';

@Repository(Product)
export default class ProductRepository extends EntityRepository<Product> {}
