import MongoDB from '../mongodb.service';
import { MongoDBEntity } from '../mongodb.type';
import { GetMoreResponse } from './types';

/**
 * Use in conjunction with commands that return a cursor, e.g. find and aggregate, to return subsequent batches of documents currently pointed to by the cursor.
 *
 * @see https://docs.mongodb.com/manual/reference/command/getMore/
 */
export default class GetMore {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getMore: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    batchSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxTimeMS: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    comment: string,
  ): Promise<GetMoreResponse[]> {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    return [];
  }
}
