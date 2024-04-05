export const isObject = (value: any) => {
  return typeof value === "object" && value != null && !Array.isArray(value);
};

export const makePaths = (
  obj: Record<string, any>,
  prefix?: string
): string[] => {
  const keys = Object.keys(obj);
  const pathPrefix = prefix ? prefix + "." : "";

  return keys.reduce<string[]>((acc, key) => {
    if (isObject(obj[key])) {
      acc = acc.concat(makePaths(obj[key], pathPrefix + key));
    } else {
      acc.push(pathPrefix + key);
    }
    return acc;
  }, []);
};
