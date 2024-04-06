import { pluginComponentTokens } from '..';

describe('pluginComponentTokens', () => {
  it('returns a PandaPlugin', () => {
    expect(pluginComponentTokens).toBeTypeOf('function');
    expect(pluginComponentTokens({}).name).toBeDefined();
    expect(pluginComponentTokens({}).hooks).toBeDefined();
  });
});
