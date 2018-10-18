const SHA256 = require('crypto-js/sha256');
const levelDB = require('./levelSandbox');

class Block {
  constructor(data) {
    this.hash = '';
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = '';
  }
}

class Blockchain {
  static async create() {
    const blockchain = new Blockchain();
    await blockchain.generateGenesisBlock();
    return blockchain;
  }

  async generateGenesisBlock() {
    const chain = await this.getChain();
    if (chain.length === 0) {
      await this.addBlock(
        new Block('First block in the chain - Genesis block')
      );
    }
  }

  async addBlock(block) {
    const previousBlock = (await this.getLastBlock()) || {
      hash: '',
      height: -1
    };
    const pureBlock = {
      ...block,
      height: previousBlock.height + 1,
      time: Math.floor(Date.now() / 1000),
      previousBlockHash: previousBlock.hash
    };
    const newBlock = {
      ...pureBlock,
      hash: SHA256(JSON.stringify(pureBlock)).toString()
    };
    await levelDB.put(newBlock.height, newBlock);
    return newBlock;
  }

  async getBlockHeight() {
    const chain = await this.getChain();
    return chain.length - 1;
  }

  async getLastBlock() {
    const chain = await this.getChain();
    return chain[chain.length - 1];
  }

  async getBlock(blockHeight) {
    return levelDB.get(blockHeight);
  }

  async getChain() {
    return levelDB.getAll();
  }
  async validateBlock(blockHeight) {
    const block = await this.getBlock(blockHeight);
    return Blockchain.validateRawBlock(block);
  }

  static validateRawBlock(block) {
    const blockHash = block.hash;
    const validBlockHash = SHA256(
      JSON.stringify({ ...block, hash: '' })
    ).toString();
    return blockHash === validBlockHash;
  }

  async validateChain() {
    const chain = await this.getChain();
    return chain.every((block, index, array) => {
      const nextBlock = array[index + 1];
      return Blockchain.validateRawBlock(block) && nextBlock
        ? block.hash === nextBlock.previousBlockHash
        : true;
    });
  }
}

module.exports = {
  Block,
  Blockchain
};
