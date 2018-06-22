import { Block, Blockchain } from './index';

const shrimpCoin = new Blockchain();

shrimpCoin.addBlock(new Block(new Date().toISOString(), { amount: 4 }));
// shrimpCoin.addBlock(new Block(new Date().toISOString(), { amount: 10 }));

// console.log(JSON.stringify(shrimpCoin, null, 4));
// console.log('Blockchain valid? ', shrimpCoin.isChainValid());
