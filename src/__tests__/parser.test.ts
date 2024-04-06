import { parser } from '../parser';
import { createContext } from '../context';

const context = createContext({
  foo: { 100: { value: { base: 'whitesmoke', lg: 'palegreen' } } },
  bar: { 100: '{colors.green.200}' },
});

describe('parser', () => {
  it('parses', () => {
    const res = parser(
      {
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: ct("foo.100"), color: ct('bar.100'))})/>`,
      },
      context,
    );

    expect(res).toMatchInlineSnapshot(
      `"<div className={css({ bg: {"base":"whitesmoke","lg":"palegreen"}, color: '{colors.green.200}')})/>"`,
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

  it('skips without a path', () => {
    const res = parser(
      {
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: ct("") })/>`,
      },
      context,
    );

    expect(res).toMatchInlineSnapshot(`"<div className={css({ bg: ct("") })/>"`);
  });
});
