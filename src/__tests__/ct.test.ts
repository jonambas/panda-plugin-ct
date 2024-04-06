import { ct, ctTemplate } from '../ct';

const tokens = {
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000' } } },
  bar: { 100: 'red', 200: 'blue' },
};

describe('ct', () => {
  it('gets a string', () => {
    expect(ct(tokens, 'bar.100')).toBe('red');
  });

  it('gets a value object', () => {
    expect(ct(tokens, 'foo.200')).toMatchInlineSnapshot(
      `
      {
        "base": "#000",
      }
    `,
    );
  });

  it('gets a value string', () => {
    expect(ct(tokens, 'foo.100')).toMatchInlineSnapshot(`"#fff"`);
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
