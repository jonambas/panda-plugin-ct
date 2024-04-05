import { type Project } from 'ts-morph';

export type ComponentTokens = { [k: string]: string | ComponentTokens };

export type PluginContext = {
  project: Project;
  tokens: ComponentTokens;
};
