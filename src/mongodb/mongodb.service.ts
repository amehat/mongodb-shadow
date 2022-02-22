import { Injectable } from '@nestjs/common';

import Store from '../store';
// eslint-disable-next-line import/no-cycle
import InsertOne from './methods/insert-one.method';
// eslint-disable-next-line sort-imports
import type { InsertOneResponse, InsertResponse } from './mongodb.type';
import WriteError from './common/write-error';
// eslint-disable-next-line import/no-cycle
import Insert from './methods/insert.method';
// eslint-disable-next-line import/no-cycle
import Find from './commands/find.command';
import type { FindResponse } from './commands/types';

@Injectable()
export default class MongoDB extends Store {
  async find<T>(find: string): Promise<FindResponse> {
    return new Find(this).execute<T>(this.databaseName, this.collectionName, find)
  }

  insertOne<T>(document: T): InsertOneResponse | WriteError {
    return new InsertOne(this).execute<T>(this.databaseName, this.collectionName, document);
  }

  insert<T>(documents: T[]): InsertResponse | InsertResponse[] | WriteError {
    return new Insert(this).execute<T>(this.databaseName, this.collectionName, documents);
  }
}
