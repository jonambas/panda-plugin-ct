import { makeMap, makePaths, mapTemplate } from '../map';

const tokens = {
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000' } } },
  bar: { 100: 'red', 200: 'blue' },
};

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
      const pluginCtMap = new Map(JSON.parse('[["foo.100","#fff"],["foo.200",{"base":"#000"}]]'));
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
