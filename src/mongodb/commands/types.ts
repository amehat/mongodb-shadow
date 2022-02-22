import { ObjectID } from 'bson';
// eslint-disable-next-line sort-imports
import type { Document } from '../mongodb.type';
import WriteError from '../common/write-error';

export type LastErrorObject = {
  updatedExisting: boolean;
  upserted: Document;
};

export type DeleteSuccess = {
  ok: number; // 1 : success, 0 : fail
  n: number;
};

export type DeleteError = DeleteSuccess & {
  writeErrors: WriteError[];
};

export type FindResponse = {
  cursor: {
    firstBatch: Document[];
    partialResultsReturned: boolean;
    id: number;
    ns: string;
  };
  ok: number; // 1 : success, 0 : fail
};

export type GetMoreResponse = {
  cursor: {
    id: number;
    ns: string;
    nextBatch: Document[];
    partialResultsReturned: boolean;
  };
  ok: number; // 1 : success, 0 : fail
  operationTime: number;
  $clusterTime: {
    clusterTime: number;
    signature: {
      hash: string;
      keyId: number;
    };
  };
};

export type FindAndModifyResponse = {
  value: Document | boolean | null;
  lastErrorObject: LastErrorObject;
  ok: number; // 1 : success, 0 : fail
};

export type GetLastErrorresponse = {
  ok: number; // 1 : success, 0 : fail
  err: null | string;
  ns: string;
  index: number;
  errmsg: string;
  code: number;
  connectionId: number;
  lastOp: number;
  n: number;
  syncMillis: number;
  shards: {
    ok: number;
    errmsg: string;
    shard: string;
    code: number;
  }[];
  singleShard: {
    ok: number;
    errmsg: string;
    shard: string;
    code: number;
  };
  updatedExisting: boolean;
  upserted: ObjectID;
  wnote: string;
  wtimeout: boolean;
  waited: number;
  wtime: number;
  writtenTo: string[];
};

export type UpdateResponse = {
  ok: number; // 1 : success, 0 : fail
  n: number;
  nModified: number;
  upserted: {
    _id: ObjectID;
    index: number;
  };
  writeErrors: WriteError[];
  writeConcernError: WriteError;
};
