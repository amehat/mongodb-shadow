import MongoDB from '../mongodb.service';
import { MongoDBEntity } from '../mongodb.type';
import { UpdateResponse } from './types';

/**
 * The update command modifies documents in a collection.
 *
 * @see https://docs.mongodb.com/manual/reference/command/update/
 */
export default class Update {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updates: [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ordered: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeConcern: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bypassDocumentValidation: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    comment: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _let: Document,
  ): Promise<UpdateResponse[]> {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    return [];
  }
}
