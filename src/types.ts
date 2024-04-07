import { LoggerInterface, LogLevel } from '@pandacss/types';
import { type Project } from 'ts-morph';

export type ComponentTokens = { [k: string]: string | ComponentTokens };

export type PluginContext = {
  project: Project;
  tokens: ComponentTokens;
  map: Map<string, string | object>;
  debug?: LoggerInterface['debug'];
};
