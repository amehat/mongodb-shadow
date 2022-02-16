import { NotFoundError, QueryOrder } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import type { AnyEntity, FilterQuery, FindOptions, Loaded, Populate } from '@mikro-orm/core';

import { serializeJson } from './helpers/string';
import type { Contraint, Item } from './types';

export default class MockStoreRepository {
  // we use a Set with IDs ase keys and Object as values
  public store = new Set();

  // count the total elements corresponding to the result when we use `where` clause
  totalResult = 0;

  operatorMongodb = ['$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$ne', '$eq', '$regex', '$re'];

  /**
   * Empty the current store
   */
  reset(): void {
    this.store = new Set();
    this.totalResult = 0;
  }

  get(id: string | number): AnyEntity | undefined {
    let result: AnyEntity | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store.forEach((record: any) => {
      if (record.id === id) {
        result = record;
      }
    });

    return result;
  }

  /**
   * Save entity to the database
   */
  async save(data: AnyEntity): Promise<AnyEntity> {
    return new Promise((resolve) => {
      if (data.id) {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        data._id = data._id ? data._id : data.id;
      } else {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        data._id = uuid();
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        data.id = data._id;
      }

      if (!data.createdAt) {
        // eslint-disable-next-line no-param-reassign
        data.createdAt = Date.now();
      }

      if (!data.updatedAt && this.get(data.id)) {
        // eslint-disable-next-line no-param-reassign
        data.updatedAt = Date.now();
      } else {
        // eslint-disable-next-line no-param-reassign
        data.updatedAt = null;
      }

      if (this.get(data.id)) {
        this.store.delete(this.get(data.id));
      }

      // Use the id as the set
      this.store.add(data);

      resolve(data);
    });
  }

  /**
   * Save entity to the database (MikroOrm)
   */
  async persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void> {
    await this.save(entity);
  }

  /**
   * Merge stored entity with new data (MikroOrm)
   */
  // eslint-disable-next-line class-methods-use-this
  assign(entity: AnyEntity, data: AnyEntity): AnyEntity {
    return { ...entity, ...data };
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  create<Entity = any>(data: Entity): Entity {
    return data;
  }

  async update(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
  ): Promise<Record<string, string | number> | undefined> {
    return new Promise((resolve, reject) => {
      if (this.store.size === 0) {
        resolve(undefined);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [...this.store.values()].forEach((record: any) => {
        if (Object.keys(condition).length !== 0) {
          Object.keys(record).forEach((indexRecord: string) => {
            if (Object.prototype.hasOwnProperty.call(record, indexRecord)) {
              this.getDataInConditionInUpdate(indexRecord, record, condition, data)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
            } else {
              resolve(undefined);
            }
          });
        } else {
          resolve(undefined);
        }
      });
    });
  }

  async getDataInConditionInUpdate(
    indexRecord: string,
    record: Record<string, string | number | boolean>,
    condition: Record<string, string | number | boolean>,
    data: Record<string, string | number>,
  ): Promise<Record<string, string | number> | undefined> {
    return new Promise((resolve, reject) => {
      // we loop over the set of conditions
      Object.keys(condition).forEach((indexCondition: string) => {
        // check that the keys we are going to use exist in the object condition
        if (Object.prototype.hasOwnProperty.call(condition, indexCondition)) {
          // We request the update of the record with the conditions and the new values passed in parameter
          this.registerChangeInStoreInUpdate(indexRecord, indexCondition, condition, record, data)
            .then((response) => resolve(response))
            .catch((e) => reject(e));
        } else {
          resolve(undefined);
        }
      });
    });
  }

  async registerChangeInStoreInUpdate(
    indexRecord: string,
    indexCondition: string | number,
    condition: Record<string, string | number | boolean>,
    record: Record<string, string | number | boolean>,
    data: Record<string, string | number>,
  ): Promise<Record<string, string | number>> {
    return new Promise((resolve, reject) => {
      if (indexRecord === indexCondition && condition[indexCondition] === record[indexRecord]) {
        // update the record object with data values
        this.getRecordAfterUpdateEntries(data, record)
          .then((recordUpdated) => {
            // we update the store with the new values of a given record, corresponding to an id
            this.store.delete(record);
            this.store.add(recordUpdated);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.store.forEach((currentRecord: any) => {
              if (currentRecord.id === record.id) {
                resolve(currentRecord);
              }
            });
          })
          .catch((e) => reject(e));
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async getRecordAfterUpdateEntries(
    data: Record<string, string | number>,
    record: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return new Promise((resolve) => {
      Object.keys(data).forEach((keyData) => {
        if (
          Object.prototype.hasOwnProperty.call(data, keyData) &&
          Object.prototype.hasOwnProperty.call(record, keyData)
        ) {
          const map = new Map();
          // saving the key-values of the record in a Map
          Object.entries(record).forEach(
            (value: [string, unknown]): Map<string, string | number> => map.set(value[0], value[1]),
          );
          // saving the key-values of the data object in a Map
          Object.keys(data).forEach((key: string | number) => map.set(key, data[key]));

          // creation of a new empty object to which we can add entries
          // Object.create(null) return [Object: null prototype] {}
          // Object.create ({}) is not used, since it would return {} which does not allow adding entry with lint
          const recordUpdated = Object.create(null);
          // assignment of new values corresponding to the key in a new object
          map.forEach((value: string | number, key: string) => {
            recordUpdated[key] = value;
          });

          // object cleaning to return a pure json object
          resolve(JSON.parse(JSON.stringify(recordUpdated)));
        } else {
          resolve(record);
        }
      });
    });
  }

  /**
   * Get entities and return total count
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAndCount<T extends AnyEntity<T>, P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>,
  ): Promise<[Loaded<T, P>[], number]> {
    const result = await this.find<T, P>(where, options);

    return [result, this.totalResult];
  }

  /**
   * Find one entity or throw a `NotFoundError`
   */
  async findOneOrFail<T>(condition: Record<string, unknown>): Promise<T> {
    if (condition.length === 0) {
      throw new NotFoundError('Not found');
    }
    const response = await this.findOne(condition);
    if (!response) {
      throw new NotFoundError('Not found');
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  async findOne(condition?: any): Promise<any> {
    const conditionType = typeof condition;

    return new Promise((resolve) => {
      if (conditionType === 'object') {
        // eslint-disable-next-line no-restricted-syntax
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.store.forEach((record: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(record).forEach((element: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.entries(condition).forEach((conditionElement: any) => {
              if (element[0] === conditionElement[0] && element[1] === conditionElement[1]) {
                resolve(record);
              }
            });
          });
        });
        resolve(null);
      } else if (conditionType === 'string' || conditionType === 'number') {
        // we are looking for an ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.store.forEach((record: any) => {
          if (record.id === condition) {
            resolve(record);
          }
        });
      }
      resolve(null);
    });
  }

  /**
   * FindOne with condition in parameter
   */
  async findOneWithCondition(
    conditions: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null> {
    return new Promise((resolve) => {
      if (this.store.size === 0) {
        resolve(null);
      }
      // the Set is transformed into a Array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [...this.store.values()].forEach(async (item: any) => {
        Object.keys(item).forEach(async (key: string) => {
          // We check that a key is present in the store and in the condition,
          // and if their value matches, we return the record
          if (item[key] === conditions[key]) {
            resolve(item);
          }

          resolve(null);
        });
      });
    });
  }

  /**
   * FindOne with string or number parameter
   */
  async findOneWithId(id: string | number): Promise<Item | null> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.store.forEach((record: any) => {
        if (record.id === id) {
          resolve(record);
        }
      });
      resolve(null);
    });
  }

  /**
   * Management of the mock of the find method with the native typing of MikroOrm
   * The where parameter is used to mock a string, a number or a simple object (ex: find ({age: 42}))
   * In the case of an object type, the MongoDB specificities are not implemented.
   * The management of these three possible types for the where parameter is done by a switch case which calls methods specific to each type.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async find<T extends AnyEntity<T>, P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>,
  ): Promise<Loaded<T, P>[]> {
    return new Promise((resolve) => {
      switch (typeof where) {
        case 'string':
          resolve(this.findInString<T, P>(where));
          break;
        case 'number':
          resolve(this.findInNumber<T, P>(where));
          break;
        case 'object':
          resolve(this.findInObject<T, P>(where, options));
          break;
        default:
          break;
      }
    });
  }

  /**
   * Processing of the find () method when it receives a string as a parameter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private findInString<T extends AnyEntity<T>, P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>,
  ): Promise<Loaded<T, P>[]> {
    return new Promise((resolve) => {
      const result: Loaded<T, P>[] = [];

      function addResult(record: Loaded<T, P>) {
        result.push(record);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.store.forEach((record: any) => {
        // If the character string passed in parameter corresponds to the id of a record,
        // we return the record
        if (record.id === where) {
          addResult(record);
        }
      });

      resolve(this.filterOptions<T, P>(result, options));
    });
  }

  /**
   * Processing of the find () method when it receives a number as a parameter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private findInNumber<T extends AnyEntity<T>, P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>,
  ): Promise<Loaded<T, P>[]> {
    return new Promise((resolve) => {
      const result: Loaded<T, P>[] = [];

      // save record in result
      function addResult(record: Loaded<T, P>) {
        result.push(record);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.store.forEach((record: any) => {
        // If the character string passed in parameter corresponds to the id of a record,
        // we return the record
        if (record.id === where) {
          addResult(record);
        }
      });

      // add order by and limit to result
      resolve(this.filterOptions(result, options));
    });
  }

  /**
   * Processing of the find () method when it receives an object as a parameter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private findInObject<T extends AnyEntity<T>, P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>,
  ): Promise<Loaded<T, P>[]> {
    return new Promise((resolve) => {
      // `where` is of type `FilterQuery<T>` and must be transformed into pure JSON to be manipulated but we keep the regexps
      const condition = serializeJson(where);
      // We return all the results if there are no conditions
      if (Object.keys(condition).length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any[] = [];
        // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-explicit-any
        this.store.forEach((record: any) => {
          result.push(record);
        });
        resolve(this.filterOptions(result, options));
      } else {
        if (this.isOperatorExist(condition)) {
          resolve(
            this.filterOptions(this.useOperatorCondition<T>(condition) as Loaded<T, P>[], options),
          );
        }
        // We return all the records corresponding to the criteria
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = Array.from(this.store.values()).filter((currentRecord: any) =>
          Object.keys(condition).every((key) =>
            currentRecord[key] && currentRecord[key] === condition[key] ? currentRecord : undefined,
          ),
        ) as Loaded<T, P>[];

        resolve(this.filterOptions(result, options));
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isOperatorExist<T extends AnyEntity<T>>(condition: Record<string, unknown> | string): boolean {
    let stm = false;
    Object.entries(condition).forEach(([, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach((key) => {
          if (this.operatorMongodb.includes(key)) {
            stm = true;
          }
        });
      }
      // With mongodb, a value of type array, corresponds to a constraint of type $in
      if (Array.isArray(value) && value !== null) {
        stm = true;
      }
    });

    return stm;
  }

  getOperatorUsedAndContraint<T extends AnyEntity<T>>(
    condition: FilterQuery<Record<string, unknown>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Contraint[] {
    const constraintList: {
      field: string;
      operator: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constraint: Record<string, any>;
    }[] = [];
    Object.entries(condition).forEach(([field, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([key, constraint]) => {
          if (this.operatorMongodb.includes(key)) {
            constraintList.push({
              field,
              operator: key,
              constraint,
            });
          }
        });
      }
    });

    return constraintList;
  }

  // eslint-disable-next-line class-methods-use-this
  transformArrayTo$in<T extends Record<string, unknown>>(
    condition: FilterQuery<T>,
  ): FilterQuery<T> {
    let where: typeof condition = condition;
    Object.entries(condition).forEach(([key, value]) => {
      if (Array.isArray(value) && value !== null) {
        where = { ...condition, [key]: { $in: value } };
      }
    });

    return where;
  }

  useOperatorCondition<T extends AnyEntity<T>>(
    condition: FilterQuery<Record<string, unknown>>,
  ): T[] {
    let result: T[] = [];
    const contraintList = this.getOperatorUsedAndContraint(this.transformArrayTo$in(condition));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store.forEach((record: any) => {
      contraintList.forEach((constraint) => {
        switch (constraint.operator) {
          case '$in':
            result = this.use$inOperator(result, record, constraint);
            break;
          case '$re':
          case '$regex':
            result = this.use$regexOperator(result, record, constraint);
            break;
          default:
            break;
        }
      });
    });

    return result;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  use$inOperator<T extends AnyEntity<T>>(result: T[], record: any, constraint: Contraint): T[] {
    if (record[constraint.field]) {
      constraint.constraint.forEach((pattern: string | RegExp) => {
        if ((pattern as unknown) instanceof RegExp) {
          const regex = new RegExp(pattern);
          if (record[constraint.field].match(regex)) {
            result.push(record);
          }
        }

        if (record[constraint.field] === pattern) {
          result.push(record);
        }
      });
    }

    return result;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  use$regexOperator<T extends AnyEntity<T>>(result: T[], record: any, constraint: Contraint): T[] {
    if (record[constraint.field]) {
      const regex = new RegExp(constraint.constraint);
      if (record[constraint.field].match(regex)) {
        result.push(record);
      }
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  private filterOptions<T extends AnyEntity<T>, P extends Populate<T> = any>(
    data: Loaded<T, P>[],
    options?: FindOptions<T, P>,
  ): Loaded<T, P>[] {
    let filteredData = data;
    // count the total elements corresponding to the result
    this.totalResult = data.length;
    if (options) {
      // order by
      const { orderBy } = options;
      if (orderBy && Object.keys(orderBy).length !== 0) {
        // key on which we will perform the scheduling
        const [key] = Object.keys(orderBy);
        // type of query order: ASC or DESC
        const [queryOrder] = Object.values(orderBy);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filteredData.sort((record1: any, record2: any): number => {
          if (typeof record1[key] === 'string') {
            return queryOrder === QueryOrder.ASC
              ? // returns by ASC order on a character string
                record1[key].localeCompare(record2[key])
              : // reorders in DESC order on a character string
                record2[key].localeCompare(record1[key]);
          }
          if (typeof record1[key] === 'number') {
            return queryOrder === QueryOrder.ASC
              ? // returns by ASC order on a number
                record1[key] - record2[key]
              : // returns in DESC order on a number
                record2[key] - record1[key];
          }

          return 0;
        });
      }
      // limit
      const { limit } = options;
      filteredData =
        limit === undefined ? filteredData : filteredData.splice(options.offset ?? 0, limit);
    }

    return filteredData;
  }

  /**
   * Delete given entity
   */
  async remove(entity: AnyEntity): Promise<Record<string, unknown>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store.forEach((record: any): unknown => {
      if (record && record.id === entity.id) {
        this.store.delete(record);

        return {};
      }

      return {};
    });

    return {};
  }

  /**
   * Delete given entity (MikroOrm)
   */
  async removeAndFlush(entity: AnyEntity): Promise<void> {
    this.remove(entity);
  }

  /**
   * Delete entity matching given its `id`
   */
  async delete(id: string | number): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store.forEach((record: any): void => {
      if (record && record.id === id) {
        this.store.delete(record);
      }
    });
  }
}
