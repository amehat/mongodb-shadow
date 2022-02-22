import { Test } from '@nestjs/testing';

import EntityRepository from '../entity.repository';
import MongoDB from '../../mongodb/mongodb.service';
import type { MongoDBEntity } from '../../mongodb/mongodb.type';

jest.mock('../../../src/mongodb/helper', () => {
  return {
    __esModule: true,
    generateId: jest.fn().mockReturnValue('917731230327257600'),
  };
});

type Product = MongoDBEntity & { name: string; price: number; qty: number };

describe('Mikro-orm', () => {
  describe('EntityRepository', () => {
    let mongodb: MongoDB;
    let entityRepository: EntityRepository<Product>;

    beforeEach(async () => {
      await Test.createTestingModule({}).compile();

      mongodb = new MongoDB();
      mongodb.useDatabase('db');
      mongodb.useCollection('products');
      entityRepository = new EntityRepository<Product>('db', 'products', mongodb);
    });
    describe('Find', () => {
      it('should return 0 results passing no arguments', async () => {
        entityRepository.mongoDB.useDatabase('db').useCollection('products');
        const productsResult = await entityRepository.find<Product>('products', {});
        expect(productsResult.ok).toBe(1);
        expect(productsResult.cursor.partialResultsReturned).toBe(false);
        expect(productsResult.cursor.firstBatch.length).toBe(0);
        expect(productsResult.cursor.id).toBe('917731230327257600');
        expect(productsResult.cursor.ns).toBe('db.products');
        expect(productsResult.cursor.firstBatch).toEqual([]);
      });

      it('should return all results passing no arguments', async () => {
        entityRepository.mongoDB.useDatabase('db').useCollection('products');
        entityRepository.mongoDB.addDocument<Product>('db', 'products', {
          name: 'pen',
          price: 10,
          qty: 1,
        });
        entityRepository.mongoDB.addDocument<Product>('db', 'products', {
          name: 'candy',
          price: 3,
          qty: 30,
        });
        entityRepository.mongoDB.addDocument<Product>('db', 'products', {
          name: 'sugar',
          price: 1,
          qty: 2,
        });
        const productsResult = await entityRepository.find<Product>('products', {});
        expect(productsResult.ok).toBe(1);
        expect(productsResult.cursor.partialResultsReturned).toBe(false);
        expect(productsResult.cursor.firstBatch.length).toBe(3);
        expect(productsResult.cursor.id).toBe('917731230327257600');
        expect(productsResult.cursor.ns).toBe('db.products');
        expect(productsResult.cursor.firstBatch[0].name).toEqual('pen');
        expect(productsResult.cursor.firstBatch[0].price).toEqual(10);
        expect(productsResult.cursor.firstBatch[0].qty).toEqual(1);
        expect(productsResult.cursor.firstBatch[1].name).toEqual('candy');
        expect(productsResult.cursor.firstBatch[1].price).toEqual(3);
        expect(productsResult.cursor.firstBatch[1].qty).toEqual(30);
        expect(productsResult.cursor.firstBatch[2].name).toEqual('sugar');
        expect(productsResult.cursor.firstBatch[2].price).toEqual(1);
        expect(productsResult.cursor.firstBatch[2].qty).toEqual(2);
      });
    });
  });
});
