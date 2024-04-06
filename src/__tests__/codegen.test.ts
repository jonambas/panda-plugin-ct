import type { CodegenPrepareHookArgs } from '@pandacss/types';
import { codegen } from '../codegen';
import { createContext } from '../context';

const context = createContext({
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000' } } },
  bar: { 100: 'red', 200: 'blue' },
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
      const pluginCtMap = new Map(JSON.parse('[["foo.100","#fff"],["foo.200",{"base":"#000"}],["bar.100","red"],["bar.200","blue"]]'));

        export const ct = (path) => {
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
      export const ct: (alias: "foo.100" | "foo.200" | "bar.100" | "bar.200") => string;",
        "file": "css.d.ts",
      }
    `);
  });
});
