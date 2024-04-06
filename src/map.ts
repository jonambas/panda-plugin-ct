import { ct } from './ct';
import type { ComponentTokens } from './types';
import { isObject } from './utils';

// Create an array of all string paths from an object.
export const makePaths = (
  obj: Record<string, any>,
  prefix?: string,
): string[] => {
  const pathPrefix = prefix ? prefix + '.' : '';
  const paths = [];

  for (const [key, value] of Object.entries(obj)) {
    if (!isObject(value) || 'value' in value) {
      paths.push(`${pathPrefix}${key}`);
    } else {
      paths.push(...makePaths(value, `${pathPrefix}${key}`));
    }
  }

  return paths;
};

// Create a Map of all alias paths and values.
export const makeMap = (tokens: ComponentTokens) => {
  const map = new Map<string, string | object>();

  for (const path of makePaths(tokens)) {
    const value = ct(tokens, path);
    if (value) {
      map.set(path, value);
    }
  }

  return map;
};

// Serialize a Map to a JSON string.
const serializeMap = (map: Map<any, any>) => {
  return JSON.stringify(Array.from(map.entries()));
};

// Generate a template string for the token alias Map.
export const mapTemplate = (map: Map<string, any>) =>
  `\nconst pluginCtMap = new Map(JSON.parse('${serializeMap(map)}'));\n`;
