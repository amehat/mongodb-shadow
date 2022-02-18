// eslint-disable-next-line import/no-cycle
import { ObjectID } from 'bson';

import type { InsertOneResponse, MongoDBEntity } from '../mongodb.type';
import WriteError from './common/write-error';
// eslint-disable-next-line import/no-cycle
import MongoDB from '../mongodb.service';

/**
 * Inserts a single document into a collection.
 * InsertOne is a mongosh method
 *
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
 * @see https://github.com/mongodb/node-mongodb-native/blob/8e2b0ccc273d18f5d744807b990f80f014ca16f6/src/operations/insert.ts
 */
export default class InsertOne {
  mongoDB: MongoDB;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    document: T,
  ): InsertOneResponse | WriteError {
    this.mongoDB.useDatabase(databaseName);
    this.mongoDB.useCollection(collectionName);

    // eslint-disable-next-line no-underscore-dangle
    if (document._id && !this.checkUniquenessObjectID(document._id)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      return new WriteError({
        index: 0,
        code: 11000,
        errmsg: `E11000 duplicate key error collection: ${databaseName}.${collectionName} index: _id_ dup key: { : 10.0 }`,
        op: document as unknown as Document,
        errInfo: document as unknown as Document,
      });
    }

    const registeredDocument = this.mongoDB.addDocument<T>(databaseName, collectionName, document);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id } = registeredDocument;

    return {
      acknowledged: true,
      insertedId: _id,
    };
  }

  checkUniquenessObjectID(id: ObjectID): boolean {
    if (
      !Array.from(
        this.mongoDB.getCollection(
          this.mongoDB.getDatabaseName(),
          this.mongoDB.getCollectionName(),
        ),
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
      ).find((document: any) => document._id === id)
    ) {
      return true;
    }

    return false;
  }
}
