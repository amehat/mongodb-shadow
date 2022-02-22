import type { DeleteError, DeleteSuccess } from './types';
import MongoDB from '../mongodb.service';
import type { MongoDBEntity } from '../mongodb.type';

/**
 * The delete command removes documents from a collection.
 *
 * @see https://docs.mongodb.com/manual/reference/command/delete/
 */
export default class Delete {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
  ): DeleteSuccess | DeleteError {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    return {
      ok: 1,
      n: 1,
    };
  }
}
