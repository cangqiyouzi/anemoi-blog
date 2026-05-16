/**
 * Mock for astro:content module in Vitest tests
 */

export function defineCollection<T>(config: T): T {
  return config;
}

export const z = {
  object: (schema: Record<string, unknown>) => ({
    parse: (data: unknown) => data,
  }),
  string: () => ({ _type: 'string' }),
  date: () => ({ _type: 'date' }),
  array: (item: unknown) => ({ _type: 'array', _item: item }),
  optional: (type: unknown) => ({ _type: 'optional', _inner: type }),
  default: (type: unknown, def: unknown) => ({ _type: 'default', _inner: type, _default: def }),
};
