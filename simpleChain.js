const SHA256 = require('crypto-js/sha256');
const levelDB = require('./levelSandbox');
const CHAIN_STATUS = 'CHAIN_STATUS';

class Block {
  constructor(data) {
    this.hash = '';
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = '';
  }

  static generateHash(block) {
    return SHA256(JSON.stringify({ ...block, hash: '' })).toString();
  }

  static validate(block) {
    const blockHash = block.hash;
    const validBlockHash = Block.generateHash(block);
    return blockHash === validBlockHash;
  }

  generateHash() {
    return Block.generateHash(this);
  }

  validate() {
    return Block.validate(this);
  }
}

class Blockchain {
  async generateGenesisBlock() {
    const blockHeight = await this.getBlockHeight();
    if (blockHeight === -1) {
      const genesis = new Block('First block in the chain - Genesis block');
      genesis.time = Math.floor(Date.now() / 1000);
      genesis.hash = genesis.generateHash();
      await levelDB.put(genesis.height, genesis);
      await levelDB.put(CHAIN_STATUS, { blockHeight: genesis.height });
    }
  }

  async addBlock(block) {
    await this.generateGenesisBlock();
    const previousBlock = await this.getLastBlock();

    block.height = previousBlock.height + 1;
    block.time = Math.floor(Date.now() / 1000);
    block.previousBlockHash = previousBlock.hash;
    block.hash = block.generateHash();

    await levelDB.put(block.height, block);
    await levelDB.put(CHAIN_STATUS, { blockHeight: block.height });
    return block;
  }
  async getBlockHeight() {
    const chainStatus = await levelDB.get(CHAIN_STATUS);
    return chainStatus ? chainStatus.blockHeight : -1;
  }

  async getLastBlock() {
    const blockHeight = await this.getBlockHeight();
    return this.getBlock(blockHeight);
  }

  async getBlock(blockHeight) {
    return levelDB.get(blockHeight);
  }
  async getChain() {
    const database = await levelDB.getAll();
    return database.filter(item => !item.blockHeight);
  }

  async validateBlock(blockHeight) {
    const block = await this.getBlock(blockHeight);
    return Block.validate(block);
  }

  async validateChain() {
    const chain = await this.getChain();
    const invalidBlocks = chain.filter(
      (block, index) =>
        !Block.validate(block) ||
        (chain[index + 1]
          ? block.hash !== chain[index + 1].previousBlockHash
          : false)
    );
    return { isValid: !invalidBlocks.length, invalidBlocks };
  }
}

module.exports = {
  Block,
  Blockchain
};
