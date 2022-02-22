import { Injectable } from '@nestjs/common';
import Product from './product.entity';
import ProductRepository from './product.repository';

@Injectable()
export default class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find<Product>({});
  }

  async save(data: Product): Promise<Product> {
    const product = this.productRepository.create(data);
    await this.productRepository.persistAndFlush(product);

    return product;
  }
}
