import { ObjectID } from 'bson';

export interface Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type MongoDBEntity = {
  _id?: ObjectID;
};

export type InsertOneResponse = {
  acknowledged: boolean;
  insertedId?: ObjectID;
};
