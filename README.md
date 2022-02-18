# mongodb-shadow

Mock MongoDB for testing with NestJS

The MongodbShadow creates an in-memory store with basic functionality.

## Example

```typescript
import { MongoDB, MongoDBShadowModule } from 'mongodb-shadow';
import type { InsertOneResponse, MongoDBEntity } from 'mongodb-shadow';

type User = MongoDBEntity & { name: string };

describe('Mongodb', () => {
  let mongodb: MongoDB;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MongoDBShadowModule],
    }).compile();

    mongodb = module.get<MongoDB>(MongoDB);
  });

  // ...
  it('...', () => {
      mongodb.createDatabase('user'); // Create Database
      mongodb.getCollection('user', 'user'); // Add Collection to Database

      // or
      mongodb.useDatabase('db'); // Create Database
      mongodb.useCollection('user'); // Add Collection to Database current

      // or
      mongodb.useDatabase('db').useCollection('user'); // Create Database and Collection

      mongodb.addDocument<User>('db', 'user', { name: 'joe doe' }); // Add Document

      expect(mongodb.getCollection<User>('db', 'user')[0].name).toEqual('joe doe'); // Verification that the registration was successful

      // Native methods

      mongodb.insertOne({ name: 'joe doe' }); // Insert One document
  });
});
```