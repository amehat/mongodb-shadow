import { DeleteStatement } from '../operations/delete.types';
import { UpdateStatement } from '../operations/update.types';

export interface BulkWriteOperationError {
  index: number;
  code: number;
  errmsg: string;
  errInfo: Document;
  op: Document | UpdateStatement | DeleteStatement;
}
