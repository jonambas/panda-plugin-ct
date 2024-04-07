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

  let ctExists = false;
  let ctReplaced = false;
  let ctAlias = 'ct';

  for (const node of source.getImportDeclarations()) {
    if (!node.getText().includes('ct')) continue;
    for (const named of node.getNamedImports()) {
      if (named.getText() === 'ct') {
        ctExists = true;
        ctAlias = named.getAliasNode()?.getText() ?? 'ct';
        break;
      }
    }
  }

  if (!ctExists) return;

  for (const node of source.getDescendantsOfKind(
    ts.SyntaxKind.CallExpression,
  )) {
    if (node.getExpression().getText() === ctAlias) {
      const path = node.getArguments()[0]?.getText().replace(/['"]/g, '');
      const value = map.get(path);

      node.replaceWithText(
        isObject(value) ? JSON.stringify(value) : `'${value}'`,
      );
      ctReplaced = true;
    }
  }

  return ctReplaced ? source.getText() : undefined;
};
