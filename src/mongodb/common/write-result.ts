import { ObjectID } from 'bson';
import { WriteConcernError } from 'mongodb';
import WriteError from './write-error';

/**
 * A wrapper that contains the result status of mongosh write methods.
 *
 * @see https://docs.mongodb.com/manual/reference/method/WriteResult/#mongodb-method-WriteResult
 */
export default class WriteResult {
  /**
   * The number of documents inserted, excluding upserted documents.
   *
   * @type {number}
   * @memberof WriteResult
   */
  nInserted: number;

  /**
   * The number of documents selected for update.
   * If the update operation results in no change to the document, e.g. $set expression updates the value to the current value, nMatched can be greater than nModified.
   *
   * @type {number}
   * @memberof WriteResult
   */
  nMatched: number;

  /**
   * The number of existing documents updated.
   * If the update/replacement operation results in no change to the document, such as setting the value of the field to its current value, nModified can be less than nMatched.
   *
   * @type {number}
   * @memberof WriteResult
   */
  nModified: number;

  /**
   * The number of documents inserted by an upsert.
   *
   * @type {number}
   * @memberof WriteResult
   * @see https://docs.mongodb.com/manual/reference/method/db.collection.update/#std-label-upsert-parameter
   */
  nUpserted: number;

  /**
   * The _id of the document inserted by an upsert.
   * Returned only if an upsert results in an insert.
   *
   * @type {ObjectID}
   * @memberof WriteResult
   */
  _id: ObjectID;

  /**
   * The number of documents removed.
   *
   * @type {number}
   * @memberof WriteResult
   */
  nRemoved: number;

  /**
   * A document that contains information regarding any error, excluding write concern errors, encountered during the write operation.
   *
   * @type {WriteError}
   * @memberof WriteResult
   */
  writeError: WriteError;

  /**
   * A document that contains information regarding any write concern errors encountered during the write operation.
   *
   * @type {WriteConcernError}
   * @memberof WriteResult
   */
  writeConcernError: WriteConcernError;
}
