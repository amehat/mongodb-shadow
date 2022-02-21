# mongodb-shadow

Mock MongoDB for testing with NestJS

The MongodbShadow creates an in-memory store with basic functionality.

## Example

With jest

```typescript
import { MongoDB, MongoDBShadowModule } from 'mongodb-shadow';
import type { InsertOneResponse, MongoDBEntity } from 'mongodb-shadow';

type User = MongoDBEntity & { name: string };

type Product = MongoDBEntity & { item: string; qty: number; type?: string };

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
      mongodb.createCollection('user', 'user'); // Add Collection to Database

      // or

      mongodb.createDatabase('user')..createCollection('user', 'user'); // Create Database and Collection

      // or
      mongodb.useDatabase('factory'); // Create Database
      mongodb.useCollection('products'); // Add Collection to Database current

      // or
      mongodb.useDatabase('db').useCollection('user'); // Create Database and Collection

      mongodb.addDocument<User>('db', 'user', { name: 'joe doe' }); // Add Document

      expect(mongodb.getCollection<User>('db', 'user')[0].name).toEqual('joe doe'); // Verification that the registration was successful
      expect(mongodb.getCollection<User>('factory', 'products')[0].item).toEqual('card');

      // Native methods

      mongodb.insertOne<Product>({ item: 'card', qty: 15 }); // Insert One document

      mongodb.insert<Product>({ item: 'card', qty: 15 }); // Insert One document
      mongodb.insert<Product>([
        { _id: 11, item: 'pencil', qty: 50, type: 'no.2' },
        { item: 'pen', qty: 20 },
        { item: 'eraser', qty: 25 },
      ]); // Insert multiple documents
  });
});
```

use with Mikro-orm

```typescript
describe('Mikro-orm', () => {
  let productService: ProductService;
  let productRepository: EntityRepository<Product>;
  const mongoDB = new MongoDB();

  beforeEach(async () => {
    productRepository = new EntityRepository<Product>('db', 'products', mongoDB);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: productRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should validate that a recording has been made', async () => {
    const data = {
      name: 'Test',
      price: 10,
      qty: 3,
    };
    expect(await productService.save(data)).toEqual(data);
    const productCollection = mongoDB.getCollection<Product>(
      mongoDB.getDatabaseName(),
      mongoDB.getCollectionName(),
    );
    expect(productCollection[0].name).toEqual(data.name);
    expect(productCollection[0].price).toEqual(data.price);
    expect(productCollection[0].qty).toEqual(data.qty);
    // eslint-disable-next-line no-underscore-dangle
    expect(productCollection[0]._id).toBeDefined();
  });
});
```

If the `--silent=false` flag is used, when a deprecated method is used, a warning message is displayed.

```bash
yarn test --silent=false

console.warn
      Deprecated mongosh Method

      26 |   ): InsertResponse | WriteError {
      27 |     // eslint-disable-next-line no-console
    > 28 |     console.warn(`Insert: Deprecated mongosh Method`);
         |             ^
      29 |
      30 |     this.mongoDB.useDatabase(databaseName);
      31 |     this.mongoDB.useCollection(collectionName);
```