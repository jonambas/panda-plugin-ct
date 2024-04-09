import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { createContext } from './context';
import type { ComponentTokens } from './types';
import { parser } from './parser';

// TODO: This is what unplugin expects, but avoiding installing @pandacss/node bc of a type conflict
// Omit<ParserResultBeforeHookArgs, 'configure'> & Pick<SourceFileHookArgs, 'context'>

type TransformArgs = Omit<ParserResultBeforeHookArgs, 'configure'>;

/**
 * Transformer for @pandabox/unplugin.
 * Replaces JS runtime calls to `ct` with their resulting class names.
 *
 * @see https://github.com/jonambas/panda-plugin-ct
 * @see https://github.com/astahmer/pandabox/tree/main/packages/unplugin
 */
export const transform = (tokens: ComponentTokens) => {
  const context = createContext(tokens);
  return (args: TransformArgs) => {
    // This doesn't have `args.configure`

    if (!args.content) return;
    return parser(args as ParserResultBeforeHookArgs, context);
  };
};
