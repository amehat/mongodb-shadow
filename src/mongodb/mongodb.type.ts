import { ObjectID } from 'bson';

export interface Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ID = ObjectID | string | number;

export type MongoDBEntity = {
  _id?: ID;
};

export type InsertResponse = {
  acknowledged: boolean;
  insertedId?: ID;
};

export type InsertOneResponse = {
  acknowledged: boolean;
  insertedId?: ID;
};
