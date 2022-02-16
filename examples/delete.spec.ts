import { Test } from "@nestjs/testing";

import MockStoreRepository from "../src/mock-store.repository";

describe('Delete', () => {
  let mockStoreRepository: MockStoreRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
        providers: [MockStoreRepository],
    }).compile();

    mockStoreRepository = module.get<MockStoreRepository>(MockStoreRepository);
  });

  it('should delete a record', () => {
    const joedoe = {
        id: 1,
        name: 'joe doe',
    };
    const janedoe = {
        id: 2,
        name: 'joe doe',
    };
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    expect(mockStoreRepository.get(1)).toEqual(joedoe);
    expect(mockStoreRepository.get(2)).toEqual(janedoe);
    mockStoreRepository.delete(2);
    expect(mockStoreRepository.get(2)).toBeUndefined();

    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.get(2)).toEqual(janedoe);
    mockStoreRepository.remove({ id: 2 });
    expect(mockStoreRepository.get(2)).toBeUndefined();

    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.get(2)).toEqual(janedoe);
    mockStoreRepository.removeAndFlush({ id: 2 });
    expect(mockStoreRepository.get(2)).toBeUndefined();
  });
});