import { get, makeMap, makePaths, mapTemplate } from '../map';

const tokens = {
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000' } } },
  bar: { 100: 'red', 200: 'blue' },
};

describe('get', () => {
  it('gets a string', () => {
    expect(get(tokens, 'bar.100')).toBe('red');
  });

  it('gets a value object', () => {
    expect(get(tokens, 'foo.200')).toMatchInlineSnapshot(
      `
      {
        "base": "#000",
      }
    `,
    );
  });

  it('gets a value string', () => {
    expect(get(tokens, 'foo.100')).toMatchInlineSnapshot(`"#fff"`);
  });

  it('gets an undefined token', () => {
    expect(get(tokens, 'nope.nope')).toBeUndefined();
    expect(get(tokens, 'foo.baz')).toBeUndefined();
  });
});

describe('makePaths', () => {
  it('makes paths', () => {
    expect(makePaths(tokens)).toMatchInlineSnapshot(`
        [
          "foo.100",
          "foo.200",
          "bar.100",
          "bar.200",
        ]
      `);
  });
});

describe('mapTemplate', () => {
  it('serializes a Map', () => {
    const map = new Map<string, any>([
      ['foo.100', '#fff'],
      ['foo.200', { base: '#000' }],
    ]);

    expect(mapTemplate(map)).toMatchInlineSnapshot(
      `
      "
      const pluginCtMap = new Map([["foo.100","#fff"],["foo.200",{"base":"#000"}]]);
      "
    `,
    );
  });
});

describe('makeMap', () => {
  it('makes a map', () => {
    expect(makeMap(tokens)).toMatchInlineSnapshot(`
      Map {
        "foo.100" => "#fff",
        "foo.200" => {
          "base": "#000",
        },
        "bar.100" => "red",
        "bar.200" => "blue",
      }
    `);
  });
});
