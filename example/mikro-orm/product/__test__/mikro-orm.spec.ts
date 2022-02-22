import { Entity } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';

import EntityRepository from '../../../../src/mikro-orm/entity.repository';
import MongoDB from '../../../../src/mongodb/mongodb.service';
import Product from '../product.entity';
import ProductRepository from '../product.repository';
import ProductService from '../product.service';


describe('Mikro-orm', () => {
  let productService: ProductService;
  let productRepository: EntityRepository<Product>;
  const mongoDB = new MongoDB();

  beforeEach(async () => {
    productRepository = new EntityRepository<Product>('db', 'products', mongoDB);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: productRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should validate that a recording has been made', async () => {
    const data = {
      name: 'Test',
      price: 10,
      qty: 3,
    };
    expect(await productService.save(data)).toEqual(data);
    const productCollection = mongoDB.getCollection<Product>(
      mongoDB.getDatabaseName(),
      mongoDB.getCollectionName(),
    );
    expect(productCollection[0].name).toEqual(data.name);
    expect(productCollection[0].price).toEqual(data.price);
    expect(productCollection[0].qty).toEqual(data.qty);
    // eslint-disable-next-line no-underscore-dangle
    expect(productCollection[0]._id).toBeDefined();
  });

  it('should return 0 results passing no arguments', async () => {
    const productCollection = mongoDB.getCollection<Product>(
      mongoDB.getDatabaseName(),
      mongoDB.getCollectionName(),
    );
    const productsResult = productCollection.find<Product>('products', {});
    expect(productsResult.length).toBe(0);
    expect(productsResult).toEqual([]);
  });
});
