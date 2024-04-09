import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { createContext } from './context';
import type { ComponentTokens } from './types';
import { parser } from './parser';

/**
 * Transformer for @pandabox/unplugin.
 * Replaces JS runtime calls to `ct` with their resulting class names.
 *
 * @see https://github.com/jonambas/panda-plugin-ct
 * @see https://github.com/astahmer/pandabox/tree/main/packages/unplugin
 */
export const transformer = (tokens: ComponentTokens) => {
  const context = createContext(tokens);
  return (args: ParserResultBeforeHookArgs) => {
    // This doesn't have `args.configure`

    if (!args.content) return;
    return parser(args, context);
  };
};
