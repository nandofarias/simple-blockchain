const SHA256 = require('crypto-js/sha256');

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

module.exports = Block;
