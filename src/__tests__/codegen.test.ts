import { codegen } from '../codegen';
import { context } from './fixtures';

describe('codegen', () => {
  it('generates ct runtime code', () => {
    const result = codegen(
      {
        artifacts: [
          {
            id: 'css-fn',
            files: [],
          },
          {
            id: 'css-index',
            files: [
              { file: 'index.mjs', code: '// ...panda code' },
              { file: 'index.d.ts', code: '// ...panda code' },
            ],
          },
        ],
        changed: [],
      },
      context,
    );
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "files": [
            {
              "code": "
      const pluginCtMap = new Map([["foo.100","#fff"],["foo.200",{"base":"#000"}],["bar.100","red"],["bar.200","blue"]]);

        export const ct = (path) => {
          if (!pluginCtMap.has(path)) return 'panda-plugin-ct_alias-not-found';
          return pluginCtMap.get(path);
        };",
              "file": "ct.mjs",
            },
            {
              "code": "export const ct: (alias: "foo.100" | "foo.200" | "bar.100" | "bar.200") => string;",
              "file": "ct.d.ts",
            },
          ],
          "id": "css-fn",
        },
        {
          "files": [
            {
              "code": "// ...panda code
      export * from './ct.mjs';",
              "file": "index.mjs",
            },
            {
              "code": "// ...panda code
      export * from './ct';",
              "file": "index.d.ts",
            },
          ],
          "id": "css-index",
        },
      ]
    `);
  });

  it('skips if artifacts dont exist', () => {
    const result = codegen(
      {
        artifacts: [],
        changed: [],
      },
      context,
    );

    expect(result).toEqual([]);
  });
});
