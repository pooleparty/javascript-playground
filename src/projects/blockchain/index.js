import { SHA256 } from 'crypto-js';

/**
 *
 */
export class Block {
  /**
   *
   * @param {Date} timestamp Describes when the block was created
   * @param {*} data Can include any type of data that should be associated with the block
   * @param {String} previousHash String that contains the hash of the previous block
   */
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;

    // When creating a new Block, automatically calculate its hash
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    console.time('MINE_BLOCK');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).fill('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.timeEnd('MINE_BLOCK');
    console.log(`BLOCK MINED: ${this.hash}`);
  }
}

export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    return new Block('0', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   *
   * @param {Block} newBlock block to add to the blockchain
   */
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.error(`Block ${i} hash mismatch`);
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Block ${i} previous hash mismatch`);
        return false;
      }
    }

    const genBlock = this.createGenesisBlock();
    // TODO: do something better for this comparison
    if (
      !(
        this.chain[0].hash === genBlock.hash &&
        this.chain[0].data === genBlock.data &&
        this.chain[0].timestamp === genBlock.timestamp &&
        this.chain[0].previousHash === genBlock.previousHash
      )
    ) {
      console.error('Genesis block mismatch');
      return false;
    }

    return true;
  }
}
