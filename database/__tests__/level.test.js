const db = require('../level');
const level = require('level');

describe('./levelSandbox', () => {
  afterEach(async () => {
    level.__clear__();
  });

  it('should put a new key/value pair', async () => {
    const result = await db.put('key_test', { key1: 'value1', key2: 'value2' });
    expect(result).toEqual('{"key1":"value1","key2":"value2"}');
  });

  it('should return the key/value pair created', async () => {
    await db.put('key_test', { key1: 'value1', key2: 'value2' });
    const result = await db.get('key_test');
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should return all values in the db', async () => {
    await db.put('key_test', { key1: 'value1', key2: 'value2' });
    await db.put('key_test_2', { key3: 'value3', key4: 'value4' });
    const result = await db.getAll();
    expect(result).toContainEqual({ key1: 'value1', key2: 'value2' });
    expect(result).toContainEqual({ key3: 'value3', key4: 'value4' });
  });
});
