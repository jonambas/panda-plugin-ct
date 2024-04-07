import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
  ArtifactContent,
} from '@pandacss/types';
import { makePaths, mapTemplate } from './map';
import type { PluginContext } from './types';
import { serializeValue } from './utils';

export const codegen = (
  args: CodegenPrepareHookArgs,
  context: PluginContext,
): MaybeAsyncReturn<void | Artifact[]> => {
  const { tokens, map } = context;
  const cssFn = args.artifacts.find((a) => a.id === 'css-fn');
  const index = args.artifacts.find((a) => a.id === 'css-index');
  const indexFile = index?.files.find((f) => f.file.includes('index.mjs'));
  const indexDtsFile = index?.files.find((f) => f.file.includes('index.d.ts'));

  if (!cssFn || !indexFile || !indexDtsFile) return args.artifacts;

  const code = `${mapTemplate(map)}
  export const ct = (path) => {
    if (!pluginCtMap.has(path)) return 'panda-plugin-ct_alias-not-found';
    return pluginCtMap.get(path);
  };`;

  const paths = makePaths(tokens)
    .map((key) => `"${key}"`)
    .join(' | ');

  const ctFile: ArtifactContent = { file: 'ct.mjs', code };
  const ctDtsFile: ArtifactContent = {
    file: 'ct.d.ts',
    code: `export const ct: (alias: ${paths}) => string;`,
  };

  cssFn.files.push(ctFile, ctDtsFile);
  indexFile.code += `\nexport * from './ct.mjs';`;
  indexDtsFile.code += `\nexport * from './ct';`;

  if (context.debug) {
    context.debug('plugin:ct', 'codegen complete');
    context.debug('plugin:ct', map);
  }

  return args.artifacts;
};
