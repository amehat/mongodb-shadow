import type { Document } from '../../mongodb.type';

/**
 * Operations command
 */

/**
 * @see https://github.com/mongodb/node-mongodb-native/blob/48cc72940ac13a81a1aef7899d227da9159f0675/src/operations/command.ts
 */
export interface CollationOptions {
  locale: string;
  caseLevel?: boolean;
  caseFirst?: string;
  strength?: number;
  numericOrdering?: boolean;
  alternate?: string;
  maxVariable?: string;
  backwards?: boolean;
  normalization?: boolean;
}

/**
 * Operations
 */

/**
 * @see https://github.com/mongodb/node-mongodb-native/blob/48cc72940ac13a81a1aef7899d227da9159f0675/src/operations/operation.ts
 */
export type Hint = string | Document;

/**
 * @see https://github.com/mongodb/node-mongodb-native/blob/48cc72940ac13a81a1aef7899d227da9159f0675/src/operations/delete.ts
 */
export interface DeleteStatement {
  /** The query that matches documents to delete. */
  q: Document;
  /** The number of matching documents to delete. */
  limit: number;
  /** Specifies the collation to use for the operation. */
  collation?: CollationOptions;
  /** A document or string that specifies the index to use to support the query predicate. */
  hint?: Hint;
  /** A user-provided comment to attach to this command */
  comment?: string | Document;
}
