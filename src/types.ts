import { ObjectID } from 'bson';

// Typing of a database record
export type Item = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type Contraint = {
  field: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constraint: any;

  operator?: string;
};

export type BaseEntity = {
  _id?: ObjectID;
};

export type Collection<T> = Set<T>;

export type Collections<T> = Map<string, Collection<T>>;

export type Database<T> = Map<string, Collections<T>>;
