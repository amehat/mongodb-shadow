import { ObjectId } from 'bson';
import { Test } from '@nestjs/testing';

import { InsertOneResponse, MongoDBEntity } from '../../../mongodb.type';
import InsertOne from '../../../mongodb/methods/insert-one.method';
import MongoDB from '../../../mongodb.service';
import MongoDBShadowModule from '../../../mongodb-shadow.module';
import WriteError from '../../../mongodb/common/write-error';

type User = MongoDBEntity & { name: string };

describe('MongoDB:insertOne', () => {
  let mongodb: MongoDB;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MongoDBShadowModule],
    }).compile();

    mongodb = module.get<MongoDB>(MongoDB);
  });

  it('should allow to insert a document with InsertOne and have a valid return', () => {
    mongodb.useDatabase('db').useCollection('user');
    const resultInsertOne = new InsertOne(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
    }) as InsertOneResponse;
    expect(resultInsertOne.acknowledged).toBeTruthy();
    expect(resultInsertOne.insertedId).toBeDefined();
    expect(resultInsertOne.insertedId).toBeInstanceOf(ObjectId);
  });

  it('should return an error in case of ObjectId already present', () => {
    mongodb.useDatabase('db').useCollection('user');
    const resultInsertOne = new InsertOne(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
    }) as InsertOneResponse;
    const objectId = resultInsertOne.insertedId;
    const resultInsertOneRetry = new InsertOne(mongodb).execute<User>('db', 'user', {
      name: 'joe doe',
      _id: objectId,
    }) as WriteError;
    expect(resultInsertOneRetry.code).toBe(11000);
    expect(resultInsertOneRetry.errmsg).toEqual(
      'E11000 duplicate key error collection: db.user index: _id_ dup key: { : 10.0 }',
    );
    expect(resultInsertOneRetry.index).toEqual(0);
    expect(resultInsertOneRetry.err.op).toEqual({ name: 'joe doe', _id: new ObjectId(objectId) });
    expect(resultInsertOneRetry.errInfo).toEqual({ name: 'joe doe', _id: new ObjectId(objectId) });
  });
});
