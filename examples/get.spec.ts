import { Test } from "@nestjs/testing";
import { NotFoundError } from '@mikro-orm/core';

import MockStoreRepository from "../src/mock-store.repository";

const joedoe = {
  id: 1,
  name: 'joe doe',
};
const janedoe = {
  id: 2,
  name: 'joe doe',
};

describe('Get', () => {
  let mockStoreRepository: MockStoreRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
        providers: [MockStoreRepository],
    }).compile();

    mockStoreRepository = module.get<MockStoreRepository>(MockStoreRepository);
  });

  it('should return a record by its id', () => {
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    expect(mockStoreRepository.get(1)).toEqual(joedoe);
    expect(mockStoreRepository.get(2)).toEqual(janedoe);
  });

  it('should return all records from a store', () => {
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    expect(Array.from(mockStoreRepository.store)).toEqual([joedoe, janedoe]);
  });

  it('should return a record with a findOne', async () => {
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    expect(await mockStoreRepository.findOne({ id: 1 })).toEqual(joedoe);
    expect(await mockStoreRepository.findOne({ id: 2 })).toEqual(janedoe);
  });

  it('should return a list of records with the number of results', async () => {
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    expect(await mockStoreRepository.findAndCount({})).toEqual([[joedoe, janedoe], 2]);
    expect(await mockStoreRepository.findAndCount({ id: 2 })).toEqual([[janedoe], 1]);
  });
});