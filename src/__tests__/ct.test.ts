import { ct, ctTemplate } from '../ct';

const tokens = {
  foo: { a: { b: { c: { value: { base: '10px', lg: '20px' } } } } },
  bar: { baz: { 100: { value: {} }, 200: { value: {} } } },
  baz: { 100: 'hello', 200: { value: 'goodbye' } },
};

describe('ct', () => {
  it('gets a string', () => {
    expect(ct(tokens, 'baz.100')).toBe('hello');
  });

  it('gets a value object', () => {
    expect(ct(tokens, 'foo.a.b.c')).toMatchInlineSnapshot(
      `
      {
        "base": "10px",
        "lg": "20px",
      }
    `,
    );
  });

  it('gets a value string', () => {
    expect(ct(tokens, 'baz.200')).toMatchInlineSnapshot(`"goodbye"`);
  });

  it('gets an undefined token', () => {
    expect(ct(tokens, 'nope.nope')).toBeUndefined();
    expect(ct(tokens, 'foo.baz')).toBeUndefined();
  });
});

describe('getTemplate', () => {
  it('generates a ct function', () => {
    expect(ctTemplate).toMatchInlineSnapshot(`
      "
      export const ct = (path) => {
        if (!path) return 'panda-plugin-ct-path-empty';
        if (!pluginCtMap.has(path)) return 'panda-plugin-ct-alias-not-found';
        return pluginCtMap.get(path);
      };
      "
    `);
  });
});
