import { IDatabaseDriver } from '@mikro-orm/core';

export default class EntityManager<D extends IDatabaseDriver = IDatabaseDriver> {
  constructor(private readonly driver: D) {}

  getDriver(): D {
    return this.driver;
  }
}
