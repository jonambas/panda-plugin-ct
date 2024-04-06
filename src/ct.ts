import type { ComponentTokens } from './types';
import { isObjectWithValue } from './utils';

export const ct = <T extends string>(tokens: ComponentTokens, path: T) => {
  const parts = path.split('.');
  let current = tokens;

  for (const part of parts) {
    if (!current[part]) break;
    current = current[part] as ComponentTokens;
  }

  if (typeof current === 'string') return current;
  if (isObjectWithValue(current)) return current.value;

  return;
};

export const ctTemplate = `
export const ct = (path) => {
  if (!path) return 'panda-plugin-ct-path-empty';
  if (!pluginCtMap.has(path)) return 'panda-plugin-ct-alias-not-found';
  return pluginCtMap.get(path);
};
`;
