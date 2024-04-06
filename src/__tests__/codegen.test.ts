import type { CodegenPrepareHookArgs } from '@pandacss/types';
import { codegen } from '../codegen';
import { createContext } from '../context';

const context = createContext({
  foo: { 100: { value: { base: 'whitesmoke', lg: 'palegreen' } } },
  bar: { 100: '{colors.green.200}' },
});

const args: CodegenPrepareHookArgs = {
  artifacts: [
    {
      id: 'css-fn',
      files: [
        { file: 'css.mjs', code: '' },
        { file: 'css.d.ts', code: '' },
      ],
    },
  ],
  changed: [],
};

describe('codegen', () => {
  it('generates ct runtime code', () => {
    const result = codegen(args, context) as any[];
    expect(result[0].files[0]).toMatchInlineSnapshot(`
      {
        "code": "
      const pluginCtMap = new Map(JSON.parse('[["foo.100",{"base":"whitesmoke","lg":"palegreen"}],["bar.100","{colors.green.200}"]]'));

      export const ct = (path) => {
        if (!path) return 'panda-plugin-ct-path-empty';
        if (!pluginCtMap.has(path)) return 'panda-plugin-ct-alias-not-found';
        return pluginCtMap.get(path);
      };
      ",
        "file": "css.mjs",
      }
    `);

    expect(result[0].files[1]).toMatchInlineSnapshot(`
      {
        "code": "
      export const ct: (alias: "foo.100" | "bar.100") => string;",
        "file": "css.d.ts",
      }
    `);
  });
});
