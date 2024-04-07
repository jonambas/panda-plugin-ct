import { parser } from '../parser';
import { context } from './fixtures';

export const makeParser = (content: string) => {
  return parser(
    {
      configure: () => {},
      filePath: 'test.tsx',
      content,
    },
    context,
  );
};

describe('parser', () => {
  it('parses', () => {
    const res = makeParser(`
    import { css, ct, cva } from '@/styled-system/css';
    
    const styles = cva({
      base: {
        // background: ct('foo.200'),
        color: ct('bar.200'),
      },
    });
    
    export const Component = () => {
      return (<div
        className={
          css({
            bg: ct('foo.200'),
            color: ct('bar.100')
          })}
      />);
    `);

    expect(res).toMatchInlineSnapshot(
      `
      "import { css, ct, cva } from '@/styled-system/css';
          
          const styles = cva({
            base: {
              // background: ct('foo.200'),
              color: 'blue',
            },
          });
          
          export const Component = () => {
            return (<div
              className={
                css({
                  bg: {"base":"#000","lg":"#111"},
                  color: 'red'
                })}
            />);
          "
    `,
    );
  });

  it('skips without ct in contents', () => {
    expect(
      makeParser(`<div className={css({ bg: "red.200" })/>`),
    ).toBeUndefined();

    expect(
      makeParser(`import { css } from '@/styled-system/css`),
    ).toBeUndefined();

    expect(
      makeParser(`import { ct } from '@/styled-system/css`),
    ).toBeUndefined();
  });
});
