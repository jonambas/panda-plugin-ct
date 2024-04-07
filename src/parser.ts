import type { ParserResultBeforeHookArgs } from '@pandacss/types';
import type { PluginContext } from './types';
import { isObject } from './utils';
import { ts } from 'ts-morph';

export const parser = (
  args: ParserResultBeforeHookArgs,
  context: PluginContext,
): string | void => {
  const { project, map } = context;

  // Note: parser won't replace `ct` calls in JSX without .tsx
  const source = project.createSourceFile('__ct-parser.tsx', args.content, {
    overwrite: true,
  });

  let exists = false;
  let alias = 'ct';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('ct')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'ct' || named.getText().startsWith('ct as')) {
        exists = true;
        alias = named.getAliasNode()?.getText() ?? 'ct';
        break;
      }
    }
  }

  if (!exists) return;

  const calls = source
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter((node) => node.getExpression().getText() === alias);

  for (const node of calls) {
    const path = node.getArguments()[0]?.getText().replace(/['"]/g, '');
    const value = map.get(path);

    node.replaceWithText(
      isObject(value) ? JSON.stringify(value) : `'${value}'`,
    );
  }

  return calls.length ? source.getText() : undefined;
};
