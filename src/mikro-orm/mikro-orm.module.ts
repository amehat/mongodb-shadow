import { AnyEntity, EntityName } from '@mikro-orm/core';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export default class MikroOrmModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  static forRoot(options?: {}): DynamicModule {
    return {
      module: MikroOrmModule,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  static forRootAsync(options: {}): DynamicModule {
    return {
      module: MikroOrmModule,
    };
  }

  static forFeature(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    options: EntityName<AnyEntity>[] | { entities?: EntityName<AnyEntity>[] },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    contextName?: string,
  ): DynamicModule {
    return {
      module: MikroOrmModule,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  static forMiddleware(options?: {}): DynamicModule {
    return {
      module: MikroOrmModule,
    };
  }
}
