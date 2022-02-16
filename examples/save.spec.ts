import { Test } from "@nestjs/testing";

import MockStoreRepository from "../src/mock-store.repository";

describe('Save', () => {
  let mockStoreRepository: MockStoreRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
        providers: [MockStoreRepository],
    }).compile();

    mockStoreRepository = module.get<MockStoreRepository>(MockStoreRepository);
  });

  it('should save a data and update it', () => {
    const joedoe = {
        id: 1,
        name: 'joe doe',
    };
    const janedoe = {
        id: 2,
        name: 'joe doe',
    };
    const anonymous = {
        id: 3,
        name: 'anonymous',
    };
    mockStoreRepository.store.add(joedoe);
    mockStoreRepository.store.add(janedoe);
    expect(mockStoreRepository.store.size).toBe(2);
    mockStoreRepository.save(anonymous);
    expect(mockStoreRepository.get(3)?.id).toEqual(3);
    expect(mockStoreRepository.get(3)?._id).toEqual(3);
    expect(mockStoreRepository.get(3)?.name).toEqual(anonymous.name);
    expect(mockStoreRepository.get(3)?.createdAt).toBeDefined();
    expect(mockStoreRepository.get(3)?.updatedAt).toBeNull();
    mockStoreRepository.save({ ...anonymous, name: 'anonymous2' });
    expect(mockStoreRepository.get(3)?.name).toEqual('anonymous2');
    expect(mockStoreRepository.get(3)?.updatedAt).toBeDefined();
  });
});