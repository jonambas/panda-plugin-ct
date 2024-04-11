import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
  ArtifactContent,
} from '@pandacss/types';
import { mapTemplate } from './map';
import type { PluginContext } from './types';
import { serializeMapTypes } from './utils';

export const codegen = (
  args: CodegenPrepareHookArgs,
  context: PluginContext,
): MaybeAsyncReturn<void | Artifact[]> => {
  const { map } = context;

  const cssFn = args.artifacts.find((a) => a.id === 'css-fn');
  const index = args.artifacts.find((a) => a.id === 'css-index');
  const indexFile = index?.files.find((f) => f.file.match(/^index\.(mjs|js)/));
  const indexDtsFile = index?.files.find((f) => f.file.includes('index.d.'));
  const ext = indexFile?.file.split('.').at(-1);
  const dtsExt = indexDtsFile?.file.split('.').at(-1);

  if (!cssFn || !indexFile || !indexDtsFile) return args.artifacts;

  const ctFile: ArtifactContent = {
    file: `ct.${ext}`,
    code: `${mapTemplate(map)}
    export const ct = (path) => {
      if (!pluginCtMap.has(path)) return 'panda-plugin-ct_alias-not-found';
      return pluginCtMap.get(path);
    };`,
  };

  const ctDtsFile: ArtifactContent = {
    file: `ct.d.${dtsExt}`,
    code: `type PluginCtMapType = {${serializeMapTypes(map)}};
    export declare const ct: <T extends keyof PluginCtMapType>(alias: T) => PluginCtMapType[T];`,
  };

  cssFn.files.push(ctFile, ctDtsFile);
  indexFile.code += `\nexport * from './ct.${ext}';`;
  indexDtsFile.code += `\nexport * from './ct';`;

  if (context.debug) {
    context.debug('plugin:ct', 'codegen complete');
    context.debug('plugin:ct', map);
  }

  return args.artifacts;
};
