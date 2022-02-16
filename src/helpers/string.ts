import type { AnyEntity, FilterQuery } from '@mikro-orm/core';

/**
 * JSON.stringify with support for RegExp
 * @see https://stackoverflow.com/questions/12075927/serialization-of-regexp
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeJson<T extends AnyEntity<T> = any>(content: FilterQuery<T>) {
    return JSON.parse(
      JSON.stringify(
        content,
        (_key: unknown, value: Record<string, unknown>) => {
          if (value instanceof RegExp) return `__REGEXP ${value.toString()}`;

          return value;
        },
        2,
      ),
      (_key: unknown, value: string) => {
        if (value.toString().indexOf('__REGEXP ') === 0) {
          const patternAndFlag = value.split('__REGEXP ')[1].match(/\/(.*)\/(.*)?/) || [];
          const pattern = patternAndFlag[1];
          const flag = patternAndFlag[2];

          return new RegExp(pattern, flag || '');
        }

        return value;
      },
    );
  }