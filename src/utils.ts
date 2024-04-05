export const isObject = (value: any) => {
  return typeof value === 'object' && value != null && !Array.isArray(value);
};

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
