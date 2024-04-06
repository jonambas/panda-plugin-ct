export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj != null && !Array.isArray(obj);
};

export const isObjectWithValue = (obj: any) => {
  return isObject(obj) && 'value' in obj;
};
