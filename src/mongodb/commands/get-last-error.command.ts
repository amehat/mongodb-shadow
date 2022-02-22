import type { GetLastErrorresponse } from './types';
import MongoDB from '../mongodb.service';
import type { MongoDBEntity } from '../mongodb.type';

/**
 *  getLastError in combination with a write operation to verify that the write succeeded
 *
 * @deprecated
 * @see https://docs.mongodb.com/manual/reference/command/getLastError/
 */
export default class GetLastError {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    j: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    w: number | string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wtimeout: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    comment: string,
  ): Promise<GetLastErrorresponse[]> {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    return [];
  }
}
