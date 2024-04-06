import { isObjectWithValue, isObject } from '../utils';

describe('isObjectWithValue', () => {
  it('returns true for an object with a value property', () => {
    expect(isObjectWithValue({ value: '' })).toBe(true);
    expect(isObjectWithValue({ value: {} })).toBe(true);
  });

  it('returns false for an object without a value property', () => {
    expect(isObjectWithValue({})).toBe(false);
  });
});

describe('isObject', () => {
  it('returns true for an object', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns false for not an object', () => {
    expect(isObject([1, 2, 3])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});
