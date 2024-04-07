import { Project, ts } from 'ts-morph';
import type { ComponentTokens, PluginContext } from './types';
import { makeMap } from './map';

export const createContext = (tokens: ComponentTokens): PluginContext => ({
  project: new Project({
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      noUnusedParameters: false,
      noEmit: true,
      useVirtualFileSystem: true,
      allowJs: true,
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    skipLoadingLibFiles: true,
  }),
  tokens,
  map: makeMap(tokens),
  debug: undefined,
});
