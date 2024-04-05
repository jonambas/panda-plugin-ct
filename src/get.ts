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

    if (typeof current === 'string') {
      return `"${current}"`;
    }

    if (isObject(current) && 'value' in current) {
      return typeof current.value === 'string'
        ? `"${current.value}"`
        : JSON.stringify(current.value);
    }

    return missing;
  };

export const getTemplate = (tokens: ComponentTokens) => `
const pluginCtTokens = ${JSON.stringify(tokens, null, 2)};

export const ct = (path) => {
  if (!path) return ${missing};

  const parts = path.split('.');
  let current = pluginCtTokens;

  for (const part of parts) {
    if (!current[part]) break;
    current = current[part];
  }

  if (typeof current === 'string') {
    return current;
  }
  
  if (typeof current === 'object' && current != null && !Array.isArray(current) && 'value' in current) {
    return current.value;
  }
  
  return ${missing};
};
`;
