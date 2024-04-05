import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { get } from './get';

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

  for (const call of calls) {
    const path = call
      .match(/['"][\w.]+['"]/)
      ?.toString()
      .replace(/['"]/g, '');
    if (!path) continue;

    const ct = get(tokens);
    newText = newText.replace(call, ct(path));
  }

  return newText;
};
