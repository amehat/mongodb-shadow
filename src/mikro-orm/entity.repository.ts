import { AnyEntity, EntityName, FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import MongoDB from '../mongodb/mongodb.service';

export default class EntityRepository<T extends AnyEntity<T>> {
  public mongoDB: MongoDB;

  private currentData: AnyEntity<T>;

  private databaseName: string;

  private collectionName: string;

  constructor(databaseName: string, collectionName: string, mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
    this.databaseName = databaseName;
    this.collectionName = collectionName;
    this.mongoDB.useDatabase(databaseName).useCollection(collectionName);
  }

  // eslint-disable-next-line class-methods-use-this
  create(data: T): T {
    return data;
  }

  async find<D extends AnyEntity<T>, P extends string = never>(
    _entityName: EntityName<T>,
    where: FilterQuery<D>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: FindOptions<T, P> = {},
  ): Promise<Loaded<T, P>[]> {
    return this.mongoDB.find<T>(JSON.parse(JSON.stringify(where))) as unknown as Loaded<T, P>[];
  }

  async persistAndFlush(entity: AnyEntity): Promise<void> {
    this.currentData = entity;
    this.flush();
  }

  async flush(): Promise<void> {
    this.mongoDB.insertOne<T>(this.currentData as T);
  }
}
