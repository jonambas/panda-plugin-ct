import type { LoggerInterface } from '@pandacss/types';
import { type Project } from 'ts-morph';

export type ComponentTokens = { [k: string]: string | ComponentTokens };

export type PluginContext = {
  project: Project;
  tokens: ComponentTokens;
  map: Map<string, string | object>;
  debug?: LoggerInterface['debug'];
  options: PluginOptions;
};

export type PluginOptions = {
  /**
   * Disables the aliases if `false`. Token paths will be used as is by Panda.
   */
  enable?: boolean;
};
