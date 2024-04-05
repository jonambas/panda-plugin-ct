import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import { Project } from 'ts-morph';
import type { ComponentTokens } from './types';

export const parser = (
  args: ParserResultBeforeHookArgs,
  tokens: ComponentTokens,
): string | void => {
  const { content } = args;
  const project = new Project();
  const source = project.createSourceFile('__temp-ct-parser.ts', content, {
    overwrite: true,
  });

  let hasCt = false;

  for (const node of source.getImportDeclarations()) {
    for (const named of node.getNamedImports()) {
      if (named.getName() === 'ct') {
        hasCt = true;
      }
    }
    if (hasCt) break;
  }

  if (!hasCt) return;

  const text = source.getText();
  const calls = text.match(/ct\(['"][\w.]+['"]\)/g) ?? [];
  let newText = text;

  const get = (path: string): string => {
    const parts = path.split('.');
    let current = tokens;

    for (const part of parts) {
      if (!current[part]) break;
      current = current[part] as ComponentTokens;
    }

    if (typeof current !== 'string') {
      return 'alias-not-found';
    }

    return current as unknown as string;
  };

  for (const call of calls) {
    const path = call
      .match(/['"][\w.]+['"]/)
      ?.toString()
      .replace(/['"]/g, '');
    if (!path) continue;
    newText = newText.replace(call, `"${get(path)}"`);
  }

  return newText;
};
