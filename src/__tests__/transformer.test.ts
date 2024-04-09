import { transformer } from '../transformer';
import type { PluginContext } from '../types';
import { context, tokens } from './fixtures';

describe('transformer', () => {
  it('returns a function', () => {
    expect(transformer(tokens)).toBeTypeOf('function');
  });

  it('replaces ct', () => {
    expect(
      transformer(tokens)({
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
      transformer(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: `<div className={css({ bg: ct("foo.200") })/>`,
      }),
    ).toBeUndefined();

    expect(
      transformer(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: `import { ct } from '@/styled-system/css`,
      }),
    ).toBeUndefined();

    expect(
      transformer(tokens)({
        configure: () => {},
        filePath: 'test.tsx',
        content: ``,
      }),
    ).toBeUndefined();
  });
});
