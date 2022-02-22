import type { Document, MongoDBEntity } from '../mongodb.type';
import type { FindResponse } from './types';
// eslint-disable-next-line import/no-cycle
import MongoDB from '../mongodb.service';
import { generateId } from '../helper';

/**
 * Executes a query and returns the first batch of results and the cursor id, from which the client can construct a cursor.
 *
 * @see https://docs.mongodb.com/manual/reference/command/find
 */
export default class Find {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    find: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sort?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projection?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hint?: Document | string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skip?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    batchSize?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    singleBatch?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    comment?: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxTimeMS?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readConcern?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    max?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    min?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnKey?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showRecordId?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tailable?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oplogReplay?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    noCursorTimeout?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    awaitData?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowPartialResults?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collation?: Document,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    allowDiskUse?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _let?: Document, // Added in MongoDB 5.0
  ): Promise<FindResponse> {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);
    const store = this.mongoDB.getCollection<T>(databaseName, collectionName);

    return {
      cursor: {
        firstBatch: store,
        partialResultsReturned: false,
        id: generateId(),
        ns: `${databaseName}.${collectionName}`,
      },
      ok: 1,
    };
  }
}
