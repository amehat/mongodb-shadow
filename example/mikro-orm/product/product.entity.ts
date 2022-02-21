import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export default class Product {
  @PrimaryKey()
  _id?: string;

  @Property()
  name: string;

  @Property()
  price: number;

  @Property()
  qty: number;
}
