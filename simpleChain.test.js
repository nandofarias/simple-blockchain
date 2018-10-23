const { Block, Blockchain } = require('./simpleChain');
const level = require('level');

describe('levelSandbox/Block', () => {
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

describe('levelSandbox/Blockchain', () => {
  let blockchain;

  beforeEach(async () => {
    blockchain = new Blockchain();
  });

  afterEach(async () => {
    level.__clear__();
  });

  it('should create the genesis block', async () => {
    await blockchain.generateGenesisBlock();
    const chain = await blockchain.getChain();
    expect(chain[0].body).toBe('First block in the chain - Genesis block');
  });

  it('should add a new block to the blockchain', async () => {
    const block = await blockchain.addBlock(new Block('test01'));
    const chain = await blockchain.getChain();
    expect(chain).toHaveLength(2);
    expect(chain).toContainEqual(block);
    expect(block.previousBlockHash).toBe(chain[0].hash);
  });

  it('should return the height of the blockchain', async () => {
    await blockchain.addBlock(new Block('test01'));
    const height = await blockchain.getBlockHeight();
    expect(height).toEqual(1);
  });

  it('should return the last block of the blockchain', async () => {
    const block = await blockchain.addBlock(new Block('test01'));
    const lastBlock = await blockchain.getLastBlock();
    expect(lastBlock).toEqual(block);
  });

  it('should return the block choosed by the height', async () => {
    await blockchain.addBlock(new Block('test01'));
    const block = await blockchain.addBlock(new Block('test02'));
    await blockchain.addBlock(new Block('test03'));
    const choosedBlock = await blockchain.getBlock(2);
    expect(choosedBlock).toEqual(block);
  });

  it('should validate a block in the blockchain', async () => {
    await blockchain.addBlock(new Block('test'));
    const isValid = await blockchain.validateBlock(1);
    expect(isValid).toBeTruthy();
  });

  it('should invalidate a block in the blockchain', async () => {
    await blockchain.addBlock(new Block('test'));
    await level().put(1, JSON.stringify(new Block('test')));
    const isValid = await blockchain.validateBlock(1);
    expect(isValid).toBeFalsy();
  });

  it('should validate the entire blockchain', async () => {
    await blockchain.addBlock(new Block('test01'));
    await blockchain.addBlock(new Block('test02'));
    const status = await blockchain.validateChain();
    expect(status.isValid).toBeTruthy();
  });

  it('should invalidate the entire blockchain by invalid hash', async () => {
    await blockchain.addBlock(new Block('test01'));
    await blockchain.addBlock(new Block('test02'));
    const block = new Block('test');
    await level().put(1, JSON.stringify(block));
    const status = await blockchain.validateChain();
    expect(status.isValid).toBeFalsy();
    expect(status.invalidBlocks).toContainEqual(block);
  });

  it('should invalidate the entire blockchain by invalid previous hash', async () => {
    const block = await blockchain.addBlock(new Block('test01'));
    await blockchain.addBlock(new Block('test02'));
    block.previousHash = '';
    block.hash = block.generateHash();
    await level().put(1, JSON.stringify(block));
    const status = await blockchain.validateChain();
    expect(status.isValid).toBeFalsy();
    expect(status.invalidBlocks).toContainEqual(block);
  });
});
