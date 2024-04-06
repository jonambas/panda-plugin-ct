import { parser } from '../parser';
import { createContext } from '../context';

const context = createContext({
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000' } } },
  bar: { 100: 'red', 200: 'blue' },
});

describe('parser', () => {
  it('parses', () => {
    const res = parser(
      {
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: ct("foo.200"), color: ct('bar.100'))})/>`,
      },
      context,
    );

    expect(res).toMatchInlineSnapshot(
      `"<div className={css({ bg: {"base":"#000"}, color: 'red')})/>"`,
    );
  });

  it('skips without "ct(" in contents', () => {
    const res = parser(
      {
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: "red.200" })/>`,
      },
      context,
    );

    expect(res).toBeUndefined();
  });
});
