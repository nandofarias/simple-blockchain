const Block = require('./Block');
const levelDB = require('../database/level');
const CHAIN_STATUS = 'CHAIN_STATUS';
class Blockchain {
  async generateGenesisBlock() {
    const blockHeight = await this.getBlockHeight();
    if (blockHeight === -1) {
      const genesis = new Block({
        address: 'genesis',
        star: {
          dec: "-26° 29' 24.9",
          ra: '16h 29m 1.0s',
          story: '5265676973746572207468652066697273742073746172'
        }
      });
      genesis.time = Math.floor(Date.now() / 1000);
      genesis.hash = genesis.generateHash();
      await levelDB.put(genesis.height, genesis);
      await levelDB.put(CHAIN_STATUS, { blockHeight: genesis.height });
    }
  }

  async addBlock(block) {
    await this.generateGenesisBlock();
    const previousBlock = await this.getLastBlock();

    block.body.star.story = Buffer.from(block.body.star.story).toString('hex');
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
    const block = await levelDB.get(blockHeight);
    block.body.star.storyDecoded = Buffer.from(
      block.body.star.story,
      'hex'
    ).toString();
    return block;
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

module.exports = Blockchain;
