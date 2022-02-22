import { Test } from "@nestjs/testing";

import { Find, MongoDB, MongoDBEntity, MongoDBShadowModule } from "../../../src";

jest.mock('../../../src/mongodb/helper', () => {
    return {
      __esModule: true,
      generateId: jest.fn().mockReturnValue('917731230327257600'),
    }
});

type User = MongoDBEntity & { name: string };

describe('Find', () => {
    let mongodb: MongoDB;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [MongoDBShadowModule],
        }).compile();

        mongodb = module.get<MongoDB>(MongoDB);
    });

    it(`devrait retourner un tableau vide si aucun enregistrement n'existe en base`, async () => {
        mongodb.useDatabase('db').useCollection('user');
        const find = 'name';
        const result = await (new Find(mongodb).execute<User>('db', 'user', find));
        expect(result).toEqual({
            cursor: {
                firstBatch: [],
                partialResultsReturned: false,
                id: '917731230327257600',
                ns: 'db.user',
              },
              ok: 1,
        });
    });

    it(`should return an array with all records`, async () => {
        mongodb.useDatabase('db').useCollection('user');
        mongodb.addDocument<User>('db', 'user', { name: 'Alice' });
        mongodb.addDocument<User>('db', 'user', { name: 'Bob' });
        mongodb.addDocument<User>('db', 'user', { name: 'Henri' });
        const find = 'name';
        const result = await (new Find(mongodb).execute<User>('db', 'user', find));
        expect(result.cursor.firstBatch.length).toEqual(3);
        expect(result.cursor.firstBatch[0].name).toEqual('Alice');
        expect(result.cursor.firstBatch[0]._id).toBeDefined();
        expect(result.cursor.firstBatch[1].name).toEqual('Bob');
        expect(result.cursor.firstBatch[1]._id).toBeDefined();
        expect(result.cursor.firstBatch[2].name).toEqual('Henri');
        expect(result.cursor.firstBatch[2]._id).toBeDefined();
        expect(result.cursor.partialResultsReturned).toBeFalsy();
        expect(result.cursor.id).toEqual('917731230327257600');
        expect(result.cursor.ns).toEqual('db.user');
        expect(result.ok).toEqual(1);
    });
});