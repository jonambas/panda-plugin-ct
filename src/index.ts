import type { PandaPlugin } from '@pandacss/types';
import { parser } from './parser';
import { codegen } from './codegen';
import type { ComponentTokens } from './types';

/**
 *
 */
const pluginComponentTokens = (tokens: ComponentTokens): PandaPlugin => {
  return {
    name: 'component-tokens',
    hooks: {
      'parser:before': (args) => {
        return parser(args, tokens);
      },
      'codegen:prepare': (args) => {
        return codegen(args, tokens);
      },
    },
  };
};

export { pluginComponentTokens, ComponentTokens };
