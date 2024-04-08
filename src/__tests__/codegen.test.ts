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
      const pluginCtMap = new Map([["foo.100","#fff"],["foo.200",{"base":"#000","lg":"#111"}],["bar.100","red"],["bar.200","blue"]]);

        export const ct = (path) => {
          if (!pluginCtMap.has(path)) return 'panda-plugin-ct_alias-not-found';
          return pluginCtMap.get(path);
        };",
              "file": "ct.mjs",
            },
            {
              "code": "type PluginCtMapType = {
        'foo.100': '#fff';
        'foo.200': {"base":"#000","lg":"#111"};
        'bar.100': 'red';
        'bar.200': 'blue';};
          export const ct: <T extends keyof PluginCtMapType>(alias: T) => PluginCtMapType[T];",
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

  it('generates ct runtime code with outExtension set to "js"', () => {
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
              { file: 'index.js', code: '' },
              { file: 'index.d.ts', code: '' },
            ],
          },
        ],
        changed: [],
      },
      { ...context, config: { outExtension: 'js' } },
    ) as any[];

    expect(result.at(0).files[0].file).toEqual('ct.js');
    expect(result.at(0).files[1].file).toEqual('ct.d.ts');
    expect(result.at(1).files[0].code).includes('./ct.js');
    expect(result.at(1).files[1].code).includes('./ct');
  });

  it('generates ct runtime code with outExtension set to "mjs" and force type extension', () => {
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
              { file: 'index.mjs', code: '' },
              { file: 'index.d.mts', code: '' },
            ],
          },
        ],
        changed: [],
      },
      { ...context, config: { forceConsistentTypeExtension: true } },
    ) as any[];

    expect(result.at(0).files[0].file).toEqual('ct.mjs');
    expect(result.at(0).files[1].file).toEqual('ct.d.mts');
    expect(result.at(1).files[0].code).includes('./ct.mjs');
    expect(result.at(1).files[1].code).includes('./ct');
  });

  it('generates ct runtime code with outExtension set to "js" and force type extension', () => {
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
              { file: 'index.js', code: '' },
              { file: 'index.d.ts', code: '' },
            ],
          },
        ],
        changed: [],
      },
      {
        ...context,
        config: { outExtension: 'js', forceConsistentTypeExtension: true },
      },
    ) as any[];

    expect(result.at(0).files[0].file).toEqual('ct.js');
    expect(result.at(0).files[1].file).toEqual('ct.d.ts');
    expect(result.at(1).files[0].code).includes('./ct.js');
    expect(result.at(1).files[1].code).includes('./ct');
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
