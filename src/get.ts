import type { ComponentTokens } from './types';
import { isObject } from './utils';

const missing = `"panda-plugin-ct-alias-not-found"`;

export const get =
  (tokens: ComponentTokens) =>
  (path: string): string => {
    if (!path) return missing;

    const parts = path.split('.');
    let current = tokens;

    for (const part of parts) {
      if (!current[part]) break;
      current = current[part] as ComponentTokens;
    }

    if (isObject(current)) {
      return 'value' in current
        ? JSON.stringify(current.value, null, 2)
        : missing;
    }

    return `"${current}"`;
  };

export const getTemplate = (tokens: ComponentTokens) => `\n
const pluginCtTokens = ${JSON.stringify(tokens, null, 2)};
const missing = "panda-plugin-ct-alias-not-found";

export const ct = (path) => {
  if (!path) return missing;

  const parts = path.split('.');
  let current = pluginCtTokens;

  for (const part of parts) {
    if (!current[part]) break;
    current = current[part];
  }

  if (typeof current === 'object' && current != null && !Array.isArray(current)) {
    return 'value' in current ? current.value : missing;
  }

  return current;
};
`;
