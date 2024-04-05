import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
} from '@pandacss/types';
import { makePaths } from './utils';
import type { PluginContext } from './types';
import { getTemplate } from './get';

export const codegen = (
  args: CodegenPrepareHookArgs,
  context: Partial<PluginContext>,
): MaybeAsyncReturn<void | Artifact[]> => {
  const tokens = context.tokens ?? {};
  if (!tokens) return;

  const cssFn = args.artifacts.find((a) => a.id === 'css-fn');
  if (!cssFn) return args.artifacts;

  const cssFile = cssFn.files.find((f) => f.file.includes('css.mjs'));
  if (!cssFile) return args.artifacts;

  cssFile.code += getTemplate(tokens);

  const cssDtsFile = cssFn.files.find((f) => f.file.includes('css.d.'));
  if (!cssDtsFile) return args.artifacts;

  const paths = makePaths(tokens)
    .map((key) => `"${key}"`)
    .join(' | ');
  cssDtsFile.code += `\nexport const ct: (alias: ${paths}) => string;`;

  return args.artifacts;
};
