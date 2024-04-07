import { createContext } from '../context';

export const tokens = {
  foo: { 100: { value: '#fff' }, 200: { value: { base: '#000', lg: '#111' } } },
  bar: { 100: 'red', 200: 'blue' },
};

const ctx = createContext(tokens);
ctx.debug = console.log;

export const context = ctx;
