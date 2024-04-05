import type { PandaPlugin } from '@pandacss/types';
import { parser } from './parser';
import { codegen } from './codegen';
import { createProject } from './create-project';
import type { ComponentTokens, PluginContext } from './types';

/**
 *
 */
const pluginComponentTokens = (tokens: ComponentTokens): PandaPlugin => {
  const context: Partial<PluginContext> = {};
  return {
    name: 'panda-plugin-ct',
    hooks: {
      'config:resolved': () => {
        context.project = createProject();
        context.tokens = tokens;
      },
      'parser:before': (args) => {
        return parser(args, context);
      },
      'codegen:prepare': (args) => {
        return codegen(args, context);
      },
    },
  };
};

export { pluginComponentTokens, ComponentTokens };
