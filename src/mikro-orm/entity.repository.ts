import { AnyEntity, EntityName } from '@mikro-orm/core';
import EntityManager from './entity-manager';

export default class EntityRepository<T extends AnyEntity<T>> {
  constructor(
    protected readonly _em: EntityManager,
    protected readonly entityName: EntityName<T>,
  ) {}
}
