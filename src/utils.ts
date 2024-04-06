export const isObject = (value: any) => {
  return typeof value === 'object' && value != null && !Array.isArray(value);
};

export const isObjectWithValue = (obj: any) => {
  return (
    typeof obj === 'object' &&
    obj != null &&
    !Array.isArray(obj) &&
    'value' in obj
  );
};
