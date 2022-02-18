import { CollationOptions, Hint } from './delete.types';

/**
 * https://github.com/mongodb/node-mongodb-native/blob/48cc72940ac13a81a1aef7899d227da9159f0675/src/operations/update.ts
 */
export interface UpdateStatement {
  /** The query that matches documents to update. */
  q: Document;
  /** The modifications to apply. */
  u: Document | Document[];
  /**  If true, perform an insert if no documents match the query. */
  upsert?: boolean;
  /** If true, updates all documents that meet the query criteria. */
  multi?: boolean;
  /** Specifies the collation to use for the operation. */
  collation?: CollationOptions;
  /** An array of filter documents that determines which array elements to modify for an update operation on an array field. */
  arrayFilters?: Document[];
  /** A document or string that specifies the index to use to support the query predicate. */
  hint?: Hint;
}
