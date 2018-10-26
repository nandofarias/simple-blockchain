const Block = require('../Block');
describe('models/Block', () => {
  it('should create a new Block', () => {
    const block = new Block('test data');
    expect(block).toEqual({
      hash: '',
      height: 0,
      body: 'test data',
      time: 0,
      previousBlockHash: ''
    });
  });

  it('should validate a block', async () => {
    const block = new Block('test');
    block.hash = block.generateHash();
    const isValid = Block.validate(block);
    expect(isValid).toBeTruthy();
  });

  it('should invalidate a block', async () => {
    const invalidBlock = new Block('teste');
    const isValid = Block.validate(invalidBlock);
    expect(isValid).toBeFalsy();
  });
});
