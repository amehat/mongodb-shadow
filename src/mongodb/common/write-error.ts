import type { BulkWriteOperationError } from './mongodb-common.types';
import type { Document } from '../../mongodb.type';

export default class WriteError {
  err: BulkWriteOperationError;

  constructor(err: BulkWriteOperationError) {
    this.err = err;
  }

  get code(): number {
    return this.err.code;
  }

  get index(): number {
    return this.err.index;
  }

  get errmsg(): string | undefined {
    return this.err.errmsg;
  }

  get errInfo(): Document | undefined {
    return this.err.errInfo;
  }

  getOperation(): Document {
    return this.err.op as Document;
  }

  toJSON(): { code: number; index: number; errmsg?: string; op: Document } {
    return {
      code: this.err.code,
      index: this.err.index,
      errmsg: this.err.errmsg,
      op: this.err.op as Document,
    };
  }

  toString(): string {
    return `WriteError(${JSON.stringify(this.toJSON())})`;
  }
}
