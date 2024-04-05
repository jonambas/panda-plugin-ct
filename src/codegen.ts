import type {
  CodegenPrepareHookArgs,
  MaybeAsyncReturn,
  Artifact,
} from '@pandacss/types';
import { makePaths } from './utils';
import type { PluginContext } from './types';

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

  cssFile.code += `\n
  const ctTokens = ${JSON.stringify(tokens, null, 2)};

  export const ct = (path) => {
    const parts = path.split(".");
    let current = ctTokens;
  
    for (const part of parts) {
      if (!current[part]) {
        break;
      }
      current = current[part];
    }
  
    if (typeof current !== "string") {
      return "panda-plugin-ct-alias-not-found";
    }
  
    return current;
  }`;

  const cssDtsFile = cssFn.files.find((f) => f.file.includes('css.d.'));
  if (!cssDtsFile) return args.artifacts;

  const paths = makePaths(tokens)
    .map((key) => `"${key}"`)
    .join(' | ');
  cssDtsFile.code += `\nexport const ct: (alias: ${paths}) => string;`;

  return args.artifacts;
};
