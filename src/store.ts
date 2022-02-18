import { Injectable } from '@nestjs/common';
import { ObjectID } from 'bson';

import type { Database } from './types';
import { MongoDBEntity } from './mongodb.type';

/**
 * Database in memory
 * Format: Structure of a database record
 *  [dabatabaseName => [{
 *    collectionName: [{}]
 *  }]]
 */
@Injectable()
export default class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected database: Database<any>;

  protected databaseName: string;

  protected collectionName: string;

  emptyDatabase(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.database = new Map<string, Map<string, Set<any>>>();
  }

  emptyCollection(databaseName: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collections = new Map<string, Set<any>>();
    this.database.set(databaseName, collections);
  }

  createDatabase(databaseName: string): Store {
    this.emptyDatabase();
    this.emptyCollection(databaseName);

    return this;
  }

  isDatabaseExist(databaseName: string): boolean {
    return this.database?.has(databaseName);
  }

  useDatabase(databaseName: string): Store {
    if (!this.isDatabaseExist(databaseName)) {
      this.createDatabase(databaseName);
    }
    this.databaseName = databaseName;

    return this;
  }

  getDatabaseName(): string {
    return this.databaseName;
  }

  createCollection<T>(databaseName: string, collectionName: string): Store {
    if (!this.database || !this.database.has(databaseName)) {
      throw new Error(`Database ${databaseName} does not exist`);
    }
    this.database.get(databaseName)?.set(collectionName, new Set<T>());

    return this;
  }

  isCollectionExist(databaseName: string, collectionName: string): boolean {
    const currentDatabase =
      this.database?.get(databaseName) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Map<string, Map<string, Set<any>>>().set(databaseName, new Map<string, Set<any>>());
    return currentDatabase.has(collectionName);
  }

  useCollection(collectionName: string): Store {
    if (!this.isCollectionExist(this.databaseName, collectionName)) {
      this.createCollection(this.databaseName, collectionName);
    }
    this.collectionName = collectionName;

    return this;
  }

  getCollectionName(): string {
    return this.collectionName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDatabase(): Map<string, Map<string, Set<any>>> {
    if (!this.database) {
      throw new Error(`Database does not exist`);
    }

    return this.database;
  }

  addDocument<T extends MongoDBEntity>(
    databaseName: string,
    collectionName: string,
    document: T,
  ): T {
    if (!this.database || !this.database.has(databaseName)) {
      throw new Error(`Database ${databaseName} does not exist`);
    }
    if (!this.database.get(databaseName)?.has(collectionName)) {
      throw new Error(`Collection ${collectionName} does not exist`);
    }
    // eslint-disable-next-line no-underscore-dangle
    if (!document._id) {
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      document._id = new ObjectID();
    }
    this.database.get(databaseName)?.get(collectionName)?.add(document);

    return document;
  }

  getCollection<T>(databaseName: string, collectionName: string): T[] {
    if (!this.database || !this.database.has(databaseName)) {
      throw new Error(`Database ${databaseName} does not exist`);
    }
    if (!this.database.get(databaseName)?.has(collectionName)) {
      throw new Error(`Collection ${collectionName} does not exist`);
    }
    const database = this.database.get(databaseName);
    const collection = database?.get(collectionName) || [];

    return [...collection];
  }
}
