import type {
  Document as DocumentMongoDB,
  ID,
  InsertResponse,
  MongoDBEntity,
} from '../../mongodb.type';
import WriteError from '../common/write-error';
// eslint-disable-next-line import/no-cycle
import MongoDB from '../../mongodb.service';
import WriteResult from '../common/write-result';

/**
 * Inserts a document or documents into a collection.
 *
 * @deprecated Deprecated mongosh Method
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.insert/
 * @see https://github.com/mongodb/node-mongodb-native/blob/8e2b0ccc273d18f5d744807b990f80f014ca16f6/src/operations/insert.ts
 */
export default class Insert {
  mongoDB: MongoDB;

  databaseName: string;

  collectionName: string;

  constructor(mongoDB: MongoDB) {
    this.mongoDB = mongoDB;
  }

  execute<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    document: T | T[],
    ordered = true,
  ): InsertResponse | InsertResponse[] | WriteError {
    // eslint-disable-next-line no-console
    console.warn(`Insert: Deprecated mongosh Method`);

    this.mongoDB.useDatabase(databaseName);
    this.databaseName = databaseName;
    this.mongoDB.useCollection(collectionName);
    this.collectionName = collectionName;

    if (Array.isArray(document)) {
      const insertResponse: InsertResponse[] = [];
      const errorList: {
        response: InsertResponse | WriteError;
        document: DocumentMongoDB;
        error: boolean;
        index: number;
      }[] = [];
      let index = 0;
      document.forEach((doc) => {
        const registerResponse = this.insertOne<T>(doc);
        if (registerResponse instanceof WriteError) {
          errorList.push({
            response: registerResponse,
            document: doc,
            error: true,
            index,
          });
        } else {
          insertResponse.push(registerResponse);
          index += 1;
          errorList.push({
            response: registerResponse,
            document: doc,
            error: false,
            index,
          });
        }
      });

      if (ordered && errorList.find((error) => error.error === true)) {
        const writeResult = new WriteResult();
        writeResult.nInserted = index;

        return writeResult.writeError;
      }

      return insertResponse;
    }

    return this.insertOne<T>(document);
  }

  private insertOne<T extends MongoDBEntity>(document: T) {
    // eslint-disable-next-line no-underscore-dangle
    if (document._id && !this.checkUniquenessObjectID(document._id)) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      return new WriteError({
        index: 0,
        code: 11000,
        errmsg: `E11000 duplicate key error collection: ${this.databaseName}.${this.collectionName} index: _id_ dup key: { : 10.0 }`,
        op: document as unknown as Document,
        errInfo: document as unknown as Document,
      });
    }

    const registeredDocument = this.mongoDB.addDocument<T>(
      this.databaseName,
      this.collectionName,
      document,
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id } = registeredDocument;

    return {
      acknowledged: true,
      insertedId: _id,
    };
  }

  checkUniquenessObjectID(id: ID): boolean {
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
