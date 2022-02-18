import { Injectable } from '@nestjs/common';

import Store from './store';
// eslint-disable-next-line import/no-cycle
import InsertOne from './mongodb/methods/insert-one.method';
import type { InsertOneResponse } from './mongodb.type';
import WriteError from './mongodb/common/write-error';

@Injectable()
export default class MongoDB extends Store {
  insertOne<T>(document: T): InsertOneResponse | WriteError {
    return new InsertOne(this).execute<T>(this.databaseName, this.collectionName, document);
  }
}
