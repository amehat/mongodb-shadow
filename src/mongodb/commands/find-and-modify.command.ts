import { FindAndModifyResponse } from './types';
import MongoDB from '../mongodb.service';
import { MongoDBEntity } from '../mongodb.type';

/**
 * The findAndModify command modifies and returns a single document
 *
 * @see https://docs.mongodb.com/manual/reference/command/findAndModify/
 */
export default class FindAndModify {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findAndModify: string,
  ): Promise<FindAndModifyResponse[]> {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    return [];
  }
}
