import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { ComponentTokens, PluginContext } from './types';

export const parser = (
  args: ParserResultBeforeHookArgs,
  context: Partial<PluginContext>,
): string | void => {
  const tokens = context.tokens ?? {};
  const project = context.project;

  if (!tokens || !project) return;

  // TODO: handle `import { ct as xyz }` aliasing
  const content = args.content;
  if (!content.includes('ct(')) return;

  const source = project.createSourceFile('__temp-ct-parser.ts', content, {
    overwrite: true,
  });

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

    // TODO: allow passing through style objects
    if (typeof current !== 'string') {
      return 'panda-plugin-ct-alias-not-found';
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
