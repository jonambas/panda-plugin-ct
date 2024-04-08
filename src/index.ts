import type { PandaPlugin } from '@pandacss/types';
import { parser } from './parser';
import { codegen } from './codegen';
import { createContext } from './context';
import type { ComponentTokens } from './types';
import { makeMap } from './map';

/**
 * @see https://github.com/jonambas/panda-plugin-ct
 */
const pluginComponentTokens = (tokens: ComponentTokens): PandaPlugin => {
  const context = createContext(tokens);
  return {
    name: 'panda-plugin-ct',
    hooks: {
      'context:created': (args) => {
        context.debug = args.logger?.debug;
        context.config = args.ctx.config;
      },
      'parser:before': (args) => {
        return parser(args, context);
      },
      'codegen:prepare': (args) => {
        context.map = makeMap(tokens);
        return codegen(args, context);
      },
    },
  };
};

export { pluginComponentTokens, ComponentTokens };
