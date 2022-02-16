import { Test } from '@nestjs/testing';
import { NotFoundError, QueryOrder } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import MockStoreRepository from '../mock-store.repository';

let mockStoreRepository: MockStoreRepository;

const now = Date.now();
Date.now = jest.fn(() => now);

const id = uuid();

const id2 = uuid();

// Mock entity
type MockEntity = {
  id: string;
  _id?: string;
  title: string;
  status: string;
};

const bob = {
  id: 'f4b206a3-2c1e-446b-8537-aa420fc6f6b7',
  name: 'Bob',
  age: 59,
  city: 'paris',
};
const alice = {
  id: '2c8dd937-f310-4101-aaba-83f69d7e0fad',
  name: 'Alice',
  age: 19,
  city: 'paris',
};
const henri = {
  id: 42,
  name: 'Henri',
  age: 18,
  city: 'londres',
};
const joe = {
  id: 'd65e672a-e754-4a6f-a69f-6ec22a09521d',
  name: 'Joe',
  age: 21,
  city: 'paris',
};
const tim = {
  id: 'f8bb192d-9865-4f5e-b2f4-bf034bc375ef',
  name: 'Tim',
  age: 19,
  city: 'paris',
};

describe('MockStoreRepository', () => {
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [MockStoreRepository],
    }).compile();

    mockStoreRepository = app.get<MockStoreRepository>(MockStoreRepository);
    mockStoreRepository.reset();
  });

  describe('get', () => {
    it('should return an entity', async () => {
      const entity: MockEntity = {
        id: uuid(),
        title: 'test',
        status: 'active',
      };

      mockStoreRepository.store.add(entity);

      const result = mockStoreRepository.get(entity.id);

      expect(result).toEqual(entity);
    });

    it('should return undefined if entity does not exist', async () => {
      const result = mockStoreRepository.get(uuid());

      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should add mandatory fields when calling `save`', async () => {
      const response = await mockStoreRepository.save({
        id,
        title: 'my test',
      });
      expect(response).toStrictEqual({
        _id: id,
        id,
        title: 'my test',
        createdAt: now,
        updatedAt: null,
      });
    });

    it('should updated data with save', async () => {
      const response = await mockStoreRepository.save({
        id,
        title: 'my test',
      });
      expect(response).toStrictEqual({
        _id: id,
        id,
        title: 'my test',
        createdAt: now,
        updatedAt: null,
      });
      const response2 = await mockStoreRepository.save({
        id,
        title: 'my test2',
      });
      expect(response2).toStrictEqual({
        _id: id,
        id,
        title: 'my test2',
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('create', () => {
    it('should return the same data on input and output', () => {
      const data = {
        id,
        _id: id,
        title: 'my test',
      };
      expect(mockStoreRepository.create(data)).toStrictEqual(data);
    });
  });

  describe('persistAndFlush', () => {
    it('should add mandatory fields when calling `persistAndFlush`', async () => {
      await mockStoreRepository.persistAndFlush({
        id,
        title: 'my test',
      });
      expect(await mockStoreRepository.findOne(id)).toStrictEqual({
        _id: id,
        id,
        title: 'my test',
        createdAt: now,
        updatedAt: null,
      });
    });
  });

  describe('findOne', () => {
    it('should return a result with a parameter of type string', async () => {
      const data = {
        id,
        _id: id,
        title: 'test',
      };
      mockStoreRepository.store.add(data);
      const response = await mockStoreRepository.findOne(id);
      expect(response.id).toEqual(data.id);
    });

    it('should return a result with a parameter of type number', async () => {
      const data = {
        id,
        _id: id,
        title: 'test',
      };
      mockStoreRepository.store.add(data);
      const response = await mockStoreRepository.findOne(id);
      expect(response.id).toEqual(data.id);
    });

    it('should return a result with a parameter of type object', async () => {
      mockStoreRepository.store.add({
        id,
        _id: id,
        title: 'test',
      });
      const response = await mockStoreRepository.findOne({ id });
      expect(response.id).toBe(id);
      // eslint-disable-next-line no-underscore-dangle
      expect(response._id).toBe(id);
      expect(response.title).toBe('test');
      mockStoreRepository.store.add({
        id: id2,
        _id: id2,
        title: 'test 2',
      });
      const response2 = await mockStoreRepository.findOne({ id: id2 });
      expect(response2.id).toBe(id2);
      const response3 = await mockStoreRepository.findOne({ id });
      expect(response3.id).toBe(id);
    });

    it('should return a result when calling `findOneWithCondition`', async () => {
      mockStoreRepository.store.add({
        id,
        _id: id,
        title: 'test',
      });
      const response = (await mockStoreRepository.findOneWithCondition({ id })) as MockEntity;
      expect(response.id).toBe(id);
      // eslint-disable-next-line no-underscore-dangle
      expect(response._id).toBe(id);
      expect(response.title).toBe('test');
    });
  });

  describe('find', () => {
    beforeEach(() => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(bob).add(alice).add(henri).add(joe);
    });

    it('should return all store records', async () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add({
        id,
        _id: id,
        title: 'test',
      });
      mockStoreRepository.store.add({
        id: id2,
        _id: id2,
        title: 'test 2',
      });
      const response = await mockStoreRepository.find({});
      expect(response).toEqual([
        {
          id,
          _id: id,
          title: 'test',
        },
        {
          id: id2,
          _id: id2,
          title: 'test 2',
        },
      ]);
    });

    it('should only find the record that matches the id passed as a parameter', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe);
      expect(await mockStoreRepository.find('2c8dd937-f310-4101-aaba-83f69d7e0fad')).toEqual([
        alice,
      ]);
      expect(await mockStoreRepository.find(42)).toEqual([henri]);
    });

    it('should return the record corresponds to the constraint of the name passed as a parameter', async () => {
      mockStoreRepository.store.add(bob).add(alice).add(henri).add(joe);
      expect(await mockStoreRepository.find({ name: 'Alice' })).toEqual([alice]);
    });

    it('should return all records with the same age constraint', async () => {
      mockStoreRepository.store.add(tim);
      expect(await mockStoreRepository.find({ age: alice.age })).toEqual([alice, tim]);
    });

    it('should return all store records according to multi criteria provided as arguments', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe).add(tim);
      expect(await mockStoreRepository.find({ age: alice.age, city: alice.city })).toEqual([
        alice,
        tim,
      ]);
    });

    it('should return limited store records according to limit option provided as arguments', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe).add(tim);
      expect(await mockStoreRepository.find({}, { limit: 2 })).toEqual([bob, alice]);
      expect(await mockStoreRepository.find({}, { limit: 3 })).toEqual([bob, alice, henri]);
    });

    it('should return ordered store records by string according to orderBy option provided as argument', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe);
      expect(await mockStoreRepository.find({}, { orderBy: { name: QueryOrder.ASC } })).toEqual([
        alice,
        bob,
        henri,
        joe,
      ]);
      expect(await mockStoreRepository.find({}, { orderBy: { name: QueryOrder.DESC } })).toEqual([
        joe,
        henri,
        bob,
        alice,
      ]);
      mockStoreRepository.store.add(tim);
      expect(
        await mockStoreRepository.find({ age: alice.age }, { orderBy: { name: QueryOrder.ASC } }),
      ).toEqual([alice, tim]);
    });

    it('should return ordered store records by number according to orderBy option provided as arguments', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe);
      expect(await mockStoreRepository.find({}, { orderBy: { age: QueryOrder.ASC } })).toEqual([
        henri,
        alice,
        joe,
        bob,
      ]);
      expect(await mockStoreRepository.find({}, { orderBy: { age: QueryOrder.DESC } })).toEqual([
        bob,
        joe,
        alice,
        henri,
      ]);
      mockStoreRepository.store.add(tim);
      expect(
        await mockStoreRepository.find({ city: alice.city }, { orderBy: { age: QueryOrder.ASC } }),
      ).toEqual([alice, tim, joe, bob]);
    });

    it('should return the list of results filtered by $in', async () => {
      mockStoreRepository.store.add(alice).add(henri).add(joe).add(tim);
      expect(await mockStoreRepository.find({ name: { $in: ['Alice'] } })).toEqual([alice]);
      expect(await mockStoreRepository.find({ age: { $in: [19] } })).toEqual([alice, tim]);
      expect(await mockStoreRepository.find({ name: { $in: [/^Alice*/] } })).toEqual([alice]);
      expect(await mockStoreRepository.find({ name: { $in: [/^Alice*/, /^Henri*/] } })).toEqual([
        alice,
        henri,
      ]);
      expect(await mockStoreRepository.find({ name: { $in: [/^Alice*/, 'Henri'] } })).toEqual([
        alice,
        henri,
      ]);
      expect(await mockStoreRepository.find({ name: { $regex: /^Alice*/ } })).toEqual([alice]);
      expect(await mockStoreRepository.find({ name: { $re: /^Alice*/ } })).toEqual([alice]);
    });
  });

  describe('isOperatorExist', () => {
    it('should return true if the operator exist', () => {
      expect(mockStoreRepository.isOperatorExist({ name: { $in: ['alice'] } })).toBe(true);
      expect(mockStoreRepository.isOperatorExist({ name: { $re: /^alice*/ } })).toBe(true);
      expect(mockStoreRepository.isOperatorExist({ name: { $regex: /^alice*/ } })).toBe(true);
    });

    it('should consider an array to be an $in and return true', () => {
      expect(mockStoreRepository.isOperatorExist({ name: ['alice'] })).toBe(true);
    });

    it('should return false if the operator does not exist', () => {
      expect(mockStoreRepository.isOperatorExist('$notIn')).toBe(false);
    });
  });

  describe('transformArrayTo', () => {
    it('should transform an array value into a constraint of type $in', () => {
      expect(mockStoreRepository.transformArrayTo$in({ name: ['Alice'] })).toEqual({
        name: { $in: ['Alice'] },
      });
      expect(mockStoreRepository.transformArrayTo$in({ name: ['Alice', 'Bob'] })).toEqual({
        name: { $in: ['Alice', 'Bob'] },
      });
    });
  });

  describe('getOperatorUsed', () => {
    it('should return the operator used', () => {
      expect(mockStoreRepository.getOperatorUsedAndContraint({ name: { $in: ['alice'] } })).toEqual(
        [
          {
            field: 'name',
            operator: '$in',
            constraint: ['alice'],
          },
        ],
      );
      expect(mockStoreRepository.getOperatorUsedAndContraint({ name: { $eq: ['alice'] } })).toEqual(
        [
          {
            operator: '$eq',
            field: 'name',
            constraint: ['alice'],
          },
        ],
      );
      expect(
        mockStoreRepository.getOperatorUsedAndContraint({
          name: { $eq: ['alice'] },
          age: { $in: [19, 21] },
        }),
      ).toEqual([
        {
          operator: '$eq',
          field: 'name',
          constraint: ['alice'],
        },
        {
          operator: '$in',
          field: 'age',
          constraint: [19, 21],
        },
      ]);
      expect(
        mockStoreRepository.getOperatorUsedAndContraint({
          name: { $re: /^alice*/ },
        }),
      ).toEqual([
        {
          operator: '$re',
          field: 'name',
          constraint: /^alice*/,
        },
      ]);
      expect(
        mockStoreRepository.getOperatorUsedAndContraint({
          name: { $regex: /^alice*/ },
        }),
      ).toEqual([
        {
          operator: '$regex',
          field: 'name',
          constraint: /^alice*/,
        },
      ]);
    });
  });

  describe('useOperatorCondition', () => {
    it('should return a result consistent with a constraint', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice).add(henri);
      const result = mockStoreRepository.useOperatorCondition({
        name: { $in: ['Alice'] },
      });
      expect(result).toEqual([alice]);
      expect(mockStoreRepository.useOperatorCondition({ name: { $regex: /^Alice*/ } })).toEqual([
        alice,
      ]);
      expect(mockStoreRepository.useOperatorCondition({ name: { $re: /^Alice*/ } })).toEqual([
        alice,
      ]);
    });

    it('should return a result consistent with the constraints', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice).add(henri).add(bob);
      const result2 = mockStoreRepository.useOperatorCondition({
        name: { $in: ['Alice', 'Henri'] },
      });
      expect(result2).toEqual([alice, henri]);
    });

    it('must return a result consistent with the constraints and corresponding to the examples in the mongodb documentation', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add({ item: 'Pens', quantity: 350, tags: ['school', 'office'] });
      mockStoreRepository.store.add({ item: 'Erasers', quantity: 15, tags: ['school', 'home'] });
      mockStoreRepository.store.add({ item: 'Maps', tags: ['office', 'storage'] });
      mockStoreRepository.store.add({
        item: 'Books',
        quantity: 5,
        tags: ['school', 'storage', 'home'],
      });
      const result = mockStoreRepository.useOperatorCondition({ quantity: { $in: [5, 15] } });
      expect(result).toEqual([
        { item: 'Erasers', quantity: 15, tags: ['school', 'home'] },
        { item: 'Books', quantity: 5, tags: ['school', 'storage', 'home'] },
      ]);
    });
  });

  describe('use$inOperator', () => {
    it('should return a result consistent with the constraints', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice).add(henri).add(bob);
      expect(
        mockStoreRepository.use$inOperator([], alice, {
          field: 'name',
          constraint: ['Alice', 'Henri'],
        }),
      ).toEqual([alice]);
      expect(
        mockStoreRepository.use$inOperator([], henri, {
          field: 'name',
          constraint: ['Alice', 'Henri'],
        }),
      ).toEqual([henri]);
      expect(
        mockStoreRepository.use$inOperator([], bob, {
          field: 'name',
          constraint: ['Alice', 'Henri'],
        }),
      ).toEqual([]);
    });

    it('should return a result consistent with the constraints regexp array', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice).add(henri).add(bob);
      expect(
        mockStoreRepository.use$inOperator([], alice, {
          field: 'name',
          constraint: [/^Alice*/, /^Henri*/],
        }),
      ).toEqual([alice]);
      expect(
        mockStoreRepository.use$inOperator([], bob, {
          field: 'name',
          constraint: [/^Alice*/, /^Henri*/],
        }),
      ).toEqual([]);
    });
  });

  describe('use$regexpOperator', () => {
    it('devrait pouvoir utiliser un operateur $regexp', () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice).add(henri).add(bob);
      expect(
        mockStoreRepository.use$regexOperator([], alice, {
          field: 'name',
          constraint: { $regex: /^Alice*/ },
        }),
      ).toEqual([alice]);
    });
  });

  describe('findAndCount', () => {
    beforeEach(() => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(bob).add(alice).add(henri).add(joe).add(tim);
    });

    it('should return all stored records', async () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add({
        id,
        _id: id,
        title: 'test',
      });
      mockStoreRepository.store.add({
        id: id2,
        _id: id2,
        title: 'test 2',
      });
      const response = await mockStoreRepository.findAndCount({});
      expect(response).toEqual([
        [
          {
            id,
            _id: id,
            title: 'test',
          },
          {
            id: id2,
            _id: id2,
            title: 'test 2',
          },
        ],
        2,
      ]);
    });

    it('should return the record corresponds to the constraint of the name passed as a parameter', async () => {
      expect(await mockStoreRepository.findAndCount({ name: 'Alice' })).toEqual([[alice], 1]);
    });

    it('should count and return the corresponds items', async () => {
      expect(await mockStoreRepository.findAndCount({ age: 19 })).toEqual([[alice, tim], 2]);
    });
  });

  describe('findOneOrFail', () => {
    it('should throw a `NotFoundError` if the item does not exist when calling `findOneOrFail`', async () => {
      await expect(() => mockStoreRepository.findOneOrFail({ id: 45 })).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('assign', () => {
    it('should adding content to entity', () => {
      const entity = {
        title: 'test',
      };
      const data = {
        content: 'super',
      };
      expect(mockStoreRepository.assign(entity, data)).toEqual({
        title: 'test',
        content: 'super',
      });
    });

    it('should update content', () => {
      const entity = {
        title: 'test',
      };
      const data = {
        title: 'super',
      };
      expect(mockStoreRepository.assign(entity, data)).toEqual({
        title: 'super',
      });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      mockStoreRepository.reset();
    });

    it('should change existing results when calling `update`', async () => {
      const data = await mockStoreRepository.save({
        id: id2,
        title: 'test',
      });
      expect(data).toEqual({
        _id: id2,
        id: id2,
        title: 'test',
        createdAt: now,
        updatedAt: null,
      });
      await mockStoreRepository.update(
        { id: id2 },
        {
          _id: id2,
          id: id2,
          title: 'test2',
        },
      );
      const response = await mockStoreRepository.findOne({ id: id2 });
      expect(response.title).toBe('test2');
      const podcast = {
        id,
        title: 'La story',
        status: 'ready-to-publish',
        createdAt: now,
        updatedAt: now,
      };
      const dataPodcast = await mockStoreRepository.save(podcast);
      expect(dataPodcast.status).toBe('ready-to-publish');
      const responsePodcast = await mockStoreRepository.update({ id }, { status: 'published' });
      expect(responsePodcast?.title).toBe('La story');
      expect(responsePodcast?.status).toBe('published');
    });

    it('should return a response when calling `getDataInConditionInUpdate`', async () => {
      const idInit = uuid();
      mockStoreRepository.store.add({
        id: idInit,
        _id: idInit,
        title: 'test',
      });
      const podcast = {
        id,
        title: 'La story',
        status: 'ready-to-publish',
        createdAt: now,
        updatedAt: now,
      };
      mockStoreRepository.store.add(podcast);
      const indexRecord = 'id';
      const condition = { id };
      const record = podcast;
      const data = {
        status: 'published',
      };
      const response = await mockStoreRepository.getDataInConditionInUpdate(
        indexRecord,
        record,
        condition,
        data,
      );
      const responsePodcast = podcast;
      responsePodcast.status = 'published';
      expect(response).toEqual(JSON.parse(JSON.stringify(responsePodcast)));
      expect(response?.status).toBe('published');
    });

    it('should return a reponse when calling `registerChangeInStoreInUpdate`', async () => {
      mockStoreRepository.store.add({
        id: id2,
        _id: id2,
        title: 'test',
      });
      const indexRecord = 'id';
      const indexCondition = 'id';
      const condition = { id };
      const record = {
        id,
        title: 'La story',
        status: 'ready-to-publish',
        createdAt: now,
      };
      const data = {
        status: 'published',
      };
      const response = await mockStoreRepository.registerChangeInStoreInUpdate(
        indexRecord,
        indexCondition,
        condition,
        record,
        data,
      );
      expect(response).toEqual({
        id,
        title: 'La story',
        status: 'published',
        createdAt: now,
      });
      const response2 = await mockStoreRepository.findOne({ id });
      expect(response2.id).toBe(id);
      expect(response2.title).toBe('La story');
      const response3 = await mockStoreRepository.findOne({ id: id2 });
      expect(response3.id).toBe(id2);
      expect(response3.title).toBe('test');
    });

    it('should return a reponse when calling `getRecordByKeyDataInUpdate`', async () => {
      const data = {
        status: 'published',
      };
      const record = {
        title: 'La story',
        status: 'ready-to-publish',
        createdAt: now,
      };
      const response = await mockStoreRepository.getRecordAfterUpdateEntries(data, record);
      expect(response.status).toBe('published');

      const record2 = {
        title: 'La story',
        status: 'ready-to-publish',
        createdAt: now,
      };
      const data2 = {
        status2: 'published',
      };
      const response2 = await mockStoreRepository.getRecordAfterUpdateEntries(data2, record2);
      expect(response2).toBe(record2);
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice);
    });

    it('should remove an entity with the remove method', async () => {
      expect(await mockStoreRepository.findOneWithId(alice.id)).toEqual(alice);
      expect(await mockStoreRepository.remove(alice)).toEqual({});
      expect(await mockStoreRepository.findOneWithId(alice.id)).toBeNull();
      expect(await mockStoreRepository.remove(alice)).toEqual({});
    });
  });

  describe('removeAndFlush', () => {
    beforeEach(async () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice);
    });

    it('should remove an entity with the removeAndFlush method', async () => {
      expect(await mockStoreRepository.findOneWithId(alice.id)).toEqual(alice);
      expect(await mockStoreRepository.removeAndFlush(alice)).toBeUndefined();
      expect(await mockStoreRepository.findOneWithId(alice.id)).toBeNull();
    });
  });
  describe('delete', () => {
    beforeEach(async () => {
      mockStoreRepository.reset();
      mockStoreRepository.store.add(alice);
    });

    it('should remove an entity with the delete method', async () => {
      expect(await mockStoreRepository.findOneWithId(alice.id)).toEqual(alice);
      expect(await mockStoreRepository.delete(alice.id)).toBeUndefined();
      expect(await mockStoreRepository.findOneWithId(alice.id)).toBeNull();
    });
  });
});
