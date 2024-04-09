import { transform } from '../transform';
import { tokens } from './fixtures';

describe('transform', () => {
  it('returns a function', () => {
    expect(transform(tokens)).toBeTypeOf('function');
  });

  it('replaces ct', () => {
    expect(
      transform(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: `
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
      `,
      }),
    ).toMatchInlineSnapshot(`
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
    `);
  });

  it('skips without imports, expressions, content', () => {
    expect(
      transform(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: ct("foo.200") })/>`,
      }),
    ).toBeUndefined();

    expect(
      transform(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: `import { ct } from '@/styled-system/css`,
      }),
    ).toBeUndefined();

    expect(
      transform(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: ``,
      }),
    ).toBeUndefined();
  });
});
