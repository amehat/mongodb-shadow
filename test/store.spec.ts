/* eslint-disable no-underscore-dangle */
import { ObjectID } from 'bson';
import { Test } from '@nestjs/testing';

import type { MongoDBEntity } from '../src';
import { Store } from '../src';

type User = MongoDBEntity & { name: string };

describe('Store', () => {
  let storeInstance: Store;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Store],
    }).compile();

    storeInstance = module.get<Store>(Store);
  });

  it('should allow the creation of a database', () => {
    expect(() => storeInstance.getDatabase()).toThrow(Error);
    expect(() => storeInstance.getDatabase()).toThrow(new Error('Database does not exist'));

    storeInstance.createDatabase('user');
    expect(storeInstance.getDatabase()).toEqual(new Map([['user', new Map()]]));
    expect(storeInstance.getDatabase().get('user')).toEqual(new Map());
  });

  it('should allow the creation of a collection', async () => {
    expect(() => storeInstance.createCollection('db', 'user')).toThrow(Error);
    expect(() => storeInstance.createCollection('db', 'user')).toThrow(
      new Error(`Database db does not exist`),
    );

    storeInstance.createDatabase('db');
    storeInstance.createCollection('db', 'user');
    expect(storeInstance.getDatabase()).toEqual(new Map([['db', new Map([['user', new Set()]])]]));
    expect(storeInstance.getDatabase()?.get('db')?.get('user')).toEqual(new Set());
  });

  it('should allow the addition of a document', () => {
    storeInstance.createDatabase('db').createCollection('db', 'user');
    storeInstance.addDocument<User>('db', 'user', { name: 'joe doe' });
    expect(storeInstance.getCollection<User>('db', 'user')[0].name).toEqual('joe doe');
    expect(storeInstance.getCollection<User>('db', 'user')[0]._id).toBeDefined();
    expect(storeInstance.getCollection<User>('db', 'user')[0]._id).toBeInstanceOf(ObjectID);

    storeInstance.addDocument<User>('db', 'user', {
      _id: new ObjectID('620e2da5b4da1c7641ed4dfe'),
      name: 'jane doe',
    });
    expect(storeInstance.getCollection<User>('db', 'user')[1].name).toEqual('jane doe');
    expect(storeInstance.getCollection<User>('db', 'user')[0]._id).toBeDefined();
    expect(storeInstance.getCollection<User>('db', 'user')[0]._id).toBeInstanceOf(ObjectID);
    expect(storeInstance.getCollection<User>('db', 'user')[1]._id).toEqual(
      new ObjectID('620e2da5b4da1c7641ed4dfe'),
    );
  });

  it('should check that a database exists', () => {
    expect(storeInstance.isDatabaseExist('db')).toBeFalsy();
    storeInstance.useDatabase('db');
    expect(storeInstance.getDatabaseName()).toEqual('db');
    expect(storeInstance.isDatabaseExist('db')).toBeTruthy();
  });

  it('should check that a collection exists', () => {
    storeInstance.useDatabase('db');
    expect(storeInstance.isCollectionExist('db', 'user')).toBeFalsy();
    expect(storeInstance.getDatabaseName()).toEqual('db');
    storeInstance.useCollection('user');
    expect(storeInstance.getCollectionName()).toEqual('user');
    expect(storeInstance.isCollectionExist('db', 'user')).toBeTruthy();
  });
});
