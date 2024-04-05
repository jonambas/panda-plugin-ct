import { isObject, makePaths } from '../utils';

describe('isObject', () => {
  it('returns true if an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ foo: 'bar' })).toBe(true);
  });

  it('returns false if not an object', () => {
    expect(isObject(1)).toBe(false);
    expect(isObject('1')).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });
});

describe('makePaths', () => {
  it('makes paths', () => {
    expect(
      makePaths({
        foo: { 100: { value: '#fff' }, 200: '' },
        bar: { 100: '', 200: '' },
      }),
    ).toMatchInlineSnapshot(`
        [
          "foo.100",
          "foo.200",
          "bar.100",
          "bar.200",
        ]
      `);
  });

  it('makes paths with object values', () => {
    expect(
      makePaths({
        foo: { a: { b: { c: { value: { base: '', lg: '' } } } } },
        bar: { baz: { 100: { value: '#fff' }, 200: { value: {} } } },
      }),
    ).toMatchInlineSnapshot(`
      [
        "foo.a.b.c",
        "bar.baz.100",
        "bar.baz.200",
      ]
    `);
  });
});
