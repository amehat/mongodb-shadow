import { AnyEntity } from '@mikro-orm/core';
import MongoDB from '../mongodb.service';

export default class EntityRepository<T extends AnyEntity<T>> {
  private currentData: AnyEntity<T>;

  private mongoDB: MongoDB;

  constructor(databaseName: string, collectionName: string, mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
    this.mongoDB.useDatabase(databaseName).useCollection(collectionName);
  }

  // eslint-disable-next-line class-methods-use-this
  create(data: T): T {
    return data;
  }

  async persistAndFlush(entity: AnyEntity): Promise<void> {
    this.currentData = entity;
    this.flush();
  }

  async flush(): Promise<void> {
    this.mongoDB.insertOne<T>(this.currentData as T);
  }
}
