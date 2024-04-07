export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj != null && !Array.isArray(obj);
};

export const isObjectWithValue = (obj: any) => {
  return isObject(obj) && 'value' in obj;
};

export const serializeMap = (map: Map<any, any>) => {
  return JSON.stringify(Array.from(map.entries()));
};

export const serializeValue = (value: any) => {
  return isObject(value) ? JSON.stringify(value) : `'${value}'`;
};

export const serializeMapTypes = (map: Map<any, any>) => {
  let code = 'const pluginCtMap = {';
  for (const [key, value] of map.entries()) {
    code += `\n  '${key}': ${serializeValue(value)},`;
  }
  code += '\n} as const;';
  return code;
};
