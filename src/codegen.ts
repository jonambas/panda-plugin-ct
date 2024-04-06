import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
} from '@pandacss/types';
import { makePaths, mapTemplate } from './map';
import type { PluginContext } from './types';

export const codegen = (
  args: CodegenPrepareHookArgs,
  context: PluginContext,
): MaybeAsyncReturn<void | Artifact[]> => {
  const { tokens, map } = context;

  const cssFn = args.artifacts.find((a) => a.id === 'css-fn');
  if (!cssFn) return args.artifacts;

  const cssFile = cssFn.files.find((f) => f.file.includes('css.mjs'));
  if (!cssFile) return args.artifacts;

  cssFile.code += '\n\n/* panda-plugin-ct codegen */';
  cssFile.code += mapTemplate(map);
  cssFile.code += `
  export const ct = (path) => {
    if (!pluginCtMap.has(path)) return 'panda-plugin-ct_alias-not-found';
    return pluginCtMap.get(path);
  };`;

  const cssDtsFile = cssFn.files.find((f) => f.file.includes('css.d.'));
  if (!cssDtsFile) return args.artifacts;

  const paths = makePaths(tokens)
    .map((key) => `"${key}"`)
    .join(' | ');
  cssDtsFile.code += `\nexport const ct: (alias: ${paths}) => string;`;

  return args.artifacts;
};
