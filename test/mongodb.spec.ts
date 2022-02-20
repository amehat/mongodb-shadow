/* eslint-disable no-underscore-dangle */
import { ObjectID } from 'bson';
import { Test } from '@nestjs/testing';

import type { InsertOneResponse, MongoDBEntity } from '../src';
import { MongoDB, MongoDBShadowModule } from '../src';

type User = MongoDBEntity & { name: string };

describe('Mongodb', () => {
  let mongodb: MongoDB;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MongoDBShadowModule],
    }).compile();

    mongodb = module.get<MongoDB>(MongoDB);
  });

  it(`should create a MongoDB-like database`, () => {
    mongodb.createDatabase('user');
    expect(mongodb.getDatabase()).toEqual(new Map([['user', new Map()]]));
  });

  it(`should create a collection looking like MongoDB`, () => {
    mongodb.createDatabase('user').createCollection('user', 'user');
    expect(mongodb.getCollection('user', 'user')).toEqual([]);
  });

  it(`should be able to add a document to the existing collection`, () => {
    mongodb.createDatabase('db').createCollection('db', 'user');
    mongodb.addDocument<User>('db', 'user', { name: 'joe doe' });
    expect(mongodb.getCollection<User>('db', 'user')[0].name).toEqual('joe doe');
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeDefined();
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeInstanceOf(ObjectID);

    mongodb.addDocument<User>('db', 'user', {
      _id: new ObjectID('620e2da5b4da1c7641ed4dfe'),
      name: 'jane doe',
    });
    expect(mongodb.getCollection<User>('db', 'user')[1].name).toEqual('jane doe');
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeDefined();
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeInstanceOf(ObjectID);
    expect(mongodb.getCollection<User>('db', 'user')[1]._id).toEqual(
      new ObjectID('620e2da5b4da1c7641ed4dfe'),
    );
  });

  it('should allow to insert a document with InsertOne and have a valid return', () => {
    const name = 'joe doe';
    mongodb.useDatabase('db').useCollection('user');
    const resultInsertOne = mongodb.insertOne({ name }) as InsertOneResponse;
    expect(resultInsertOne.acknowledged).toBeTruthy();
    expect(resultInsertOne.insertedId).toBeDefined();
    expect(resultInsertOne.insertedId).toBeInstanceOf(ObjectID);
    expect(mongodb.getCollection<User>('db', 'user').length).toEqual(1);
    expect(mongodb.getCollection<User>('db', 'user')[0].name).toEqual(name);
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeDefined();
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toBeInstanceOf(ObjectID);
    expect(mongodb.getCollection<User>('db', 'user')[0]._id).toEqual(resultInsertOne.insertedId);
  });
});
