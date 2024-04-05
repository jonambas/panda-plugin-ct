import { get } from '../get';

const tokens = {
  foo: { a: { b: { c: { value: { base: '10px', lg: '20px' } } } } },
  bar: { baz: { 100: { value: {} }, 200: { value: {} } } },
  baz: { 100: 'hello', 200: 'goodbye' },
};

describe('get', () => {
  it('gets a string value', () => {
    expect(get(tokens)('baz.100')).toBe('"hello"');
  });

  it('gets an object value', () => {
    expect(get(tokens)('foo.a.b.c')).toMatchInlineSnapshot(`
      "{
        "base": "10px",
        "lg": "20px"
      }"
    `);
  });

  it('gets an undefined token', () => {
    expect(get(tokens)('nope.nope')).toBe(`"panda-plugin-ct-alias-not-found"`);
  });

  it('gets an undefined path', () => {
    // @ts-expect-error Checking arg omission
    expect(get(tokens)()).toBe(`"panda-plugin-ct-alias-not-found"`);
  });
});
