import { get, getTemplate } from '../get';

const tokens = {
  foo: { a: { b: { c: { value: { base: '10px', lg: '20px' } } } } },
  bar: { baz: { 100: { value: {} }, 200: { value: {} } } },
  baz: { 100: 'hello', 200: { value: 'goodbye' } },
};

describe('get', () => {
  it('gets a string', () => {
    expect(get(tokens)('baz.100')).toBe('"hello"');
  });

  it('gets a value object', () => {
    expect(get(tokens)('foo.a.b.c')).toMatchInlineSnapshot(
      `"{"base":"10px","lg":"20px"}"`,
    );
  });

  it('gets a value string', () => {
    expect(get(tokens)('baz.200')).toMatchInlineSnapshot(`""goodbye""`);
  });

  it('gets an undefined token', () => {
    expect(get(tokens)('nope.nope')).toBe(`"panda-plugin-ct-alias-not-found"`);
  });

  it('gets an undefined path', () => {
    // @ts-expect-error Checking arg omission
    expect(get(tokens)()).toBe(`"panda-plugin-ct-alias-not-found"`);
  });
});

describe('getTemplate', () => {
  it('generates a ct function', () => {
    expect(getTemplate({ foo: { value: { base: '#fff', md: '#000' } } }))
      .toMatchInlineSnapshot(`
        "
        const pluginCtTokens = {
          "foo": {
            "value": {
              "base": "#fff",
              "md": "#000"
            }
          }
        };

        export const ct = (path) => {
          if (!path) return "panda-plugin-ct-alias-not-found";

          const parts = path.split('.');
          let current = pluginCtTokens;

          for (const part of parts) {
            if (!current[part]) break;
            current = current[part];
          }

          if (typeof current === 'string') {
            return current;
          }
          
          if (typeof current === 'object' && current != null && !Array.isArray(current) && 'value' in current) {
            return current.value;
          }
          
          return "panda-plugin-ct-alias-not-found";
        };
        "
      `);
  });
});
