# mongodb-shadow

mongodb mock for nestjs

The MockStoreRepository creates an in-memory store with basic functionality.

It was set up to interface with the orm Mikro-orm.

- create
- save
- find (Only the operators $in, $re and $regex go first level can be used)
- findOne
- findOneOrFail
- findAndCount
- persistAndFlush
- remove
- removeAndFlush
- delete

The $re operator corresponds to the $regex operator but for the orm Mikro-orm.