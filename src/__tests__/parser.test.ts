import { parser } from '../parser';
import type { PluginContext } from '../types';
import { context, disabledContext } from './fixtures';

export const makeParser = (content: string, ctx: PluginContext = context) => {
  return parser(
    {
      configure: () => {},
      filePath: 'test.tsx',
      content,
    },
    ctx,
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

    expect(res).toMatchInlineSnapshot(`
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

  it('parses with an alias', () => {
    const res = makeParser(`
    import { css, ct as alias, cva } from '@/styled-system/css';
    
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
            bg: alias('foo.200'),
            color: alias('bar.100')
          })}
      />);
    `);

    expect(res).toMatchInlineSnapshot(`
      "import { css, ct as alias, cva } from '@/styled-system/css';
          
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
                  bg: {"base":"#000","lg":"#111"},
                  color: 'red'
                })}
            />);
          "
    `);
  });

  it('passes through paths when enable is set to false', () => {
    const res = parser(
      {
        configure: vi.fn(),
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
      },
      disabledContext,
    );

    expect(res).toMatchInlineSnapshot(`
      "import { css, ct, cva } from '@/styled-system/css';
            
            const styles = cva({
              base: {
                // background: ct('foo.200'),
                color: 'bar.200',
              },
            });
            
            export const Component = () => {
              return (<div
                className={
                  css({
                    bg: 'foo.200',
                    color: 'bar.100'
                  })}
              />);
            "
    `);
  });

  it('skips without ct imports or expressions', () => {
    expect(
      makeParser(`<div className={css({ bg: ct("foo.200") })/>`),
    ).toBeUndefined();

    expect(
      makeParser(`import { ct } from '@/styled-system/css`),
    ).toBeUndefined();
  });
});
