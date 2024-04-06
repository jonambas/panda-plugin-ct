import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { isObject } from './utils';

export const parser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project, map } = context;

  // TODO: handle `import { ct as xyz }` aliasing
  const content = args.content;
  if (!content.includes('ct(')) return;

  const source = project.createSourceFile('__temp-ct-parser.ts', content, {
    overwrite: true,
  });

  let text = source.getText();
  const calls = text.match(/ct\(['"][\w.]+['"]\)/g) ?? [];

  for (const call of calls) {
    const path = call
      .match(/['"][\w.]+['"]/)
      ?.toString()
      .replace(/['"]/g, '');
    if (!path) continue;
    const value = map.get(path);
    text = text.replace(
      call,
      isObject(value) ? JSON.stringify(value) : `'${value}'`,
    );
  }

  return text;
};
