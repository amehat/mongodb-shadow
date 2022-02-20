import { ObjectId } from 'bson';
import { Test } from '@nestjs/testing';

import { Insert, MongoDB, MongoDBShadowModule, WriteError } from '../../../src';
import type { InsertResponse, MongoDBEntity } from '../../../src';

type User = MongoDBEntity & { name: string };

describe('MongoDB:insert', () => {
  let mongodb: MongoDB;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MongoDBShadowModule],
    }).compile();

    mongodb = module.get<MongoDB>(MongoDB);
  });

  it('should allow to insert a document with Insert and have a valid return', () => {
    mongodb.useDatabase('db').useCollection('user');
    const resultInsert = new Insert(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
    }) as InsertResponse;
    expect(resultInsert.acknowledged).toBeTruthy();
    expect(resultInsert.insertedId).toBeDefined();
    expect(resultInsert.insertedId).toBeInstanceOf(ObjectId);
  });

  it('should return an error in case of ObjectId already present', () => {
    mongodb.useDatabase('db').useCollection('user');
    const resultInsert = new Insert(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
    }) as InsertResponse;
    const objectId = resultInsert.insertedId;
    const resultInsertRetry = new Insert(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
      _id: objectId,
    }) as WriteError;
    expect(resultInsertRetry.code).toBe(11000);
    expect(resultInsertRetry.errmsg).toEqual(
      'E11000 duplicate key error collection: db.user index: _id_ dup key: { : 10.0 }',
    );
    expect(resultInsertRetry.index).toEqual(0);
    expect(resultInsertRetry.err.op).toEqual({ name: 'joe doe', _id: new ObjectId(objectId) });
    expect(resultInsertRetry.errInfo).toEqual({ name: 'joe doe', _id: new ObjectId(objectId) });
  });

  it('devrait pouvoir insérer plusieurs documents', () => {
    type Product = MongoDBEntity & { item: string; qty: number; type?: string };
    const documents = [
      { _id: 11, item: 'pencil', qty: 50, type: 'no.2' },
      { item: 'pen', qty: 20 },
      { item: 'eraser', qty: 25 },
    ];
    const resultInsert = new Insert(mongodb).execute<Product>('db', 'user', documents);
    expect((resultInsert as InsertResponse[]).length).toEqual(3);
    // eslint-disable-next-line no-underscore-dangle
    expect((resultInsert as InsertResponse[])[0].insertedId).toEqual(11);
    expect((resultInsert as InsertResponse[])[0].acknowledged).toEqual(true);
    expect((resultInsert as InsertResponse[])[1].insertedId).toBeInstanceOf(ObjectId);
    expect((resultInsert as InsertResponse[])[2].insertedId).toBeInstanceOf(ObjectId);
  });
});
