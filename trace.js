const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://35.221.208.98:8545'));
// first: 35.221.208.98
//another endpoint:   35.200.37.219

async function getInternalsFromBlock(bHash) {
  const block = await web3.eth.getBlock(bHash);
  console.log('Block #' + block.number);
  for (let i = 0; i < block.transactions.length; i++) {
    let txHash = block.transactions[i];
    console.log(txHash);
    let tx = await web3.eth.getTransaction(txHash).catch((e) => console.log('an error occured while getting the transaction'));
    let tr = await web3.eth.getTransactionReceipt(txHash);  // this one seems not returning well, promised?
    console.log(tx.value);
    console.log(`${tr.transactionIndex}: ${tx.from} -> ${tx.to} (${tx.value} wei, ${tr.cumulativeGasUsed} gas, ${tr.logs.length} event(s))`);
    //if (tr.contractAddress) {
    //  console.log('   Contract created at ' + tr.contractAddress);
    //}

    let tfs = await trace.getInternalTransfers(web3.currentProvider, txHash, tx.to);
    // console.log(tfs);
    _(tfs).each(tf => {
      console.log(`  ${tf.senderAddress} -> ${tf.recipientAddress} (${tf.etherSent} wei)`);
    });
  }
}

(async () => {

  let blockHash = '0x936b109ad813df99ae7b57c98c0019987eca8b986d2cd85b368620f561999532'; // (#2031)
  await getInternalsFromBlock(blockHash);

  blockHash = '0xbce3f81ce2db539901e1c527369c1d3e928c3f58ebf817db42e90a64e366bb23'; // (#10930)
  await getInternalsFromBlock(blockHash);

  blockHash = '0x7077f0d7d9bf245c2656c8fcc62c27da27dc35e48b38a6b1fcb0e12c43a7f2e3'; // (#2000003)
  await getInternalsFromBlock(blockHash);

  blockHash = '0x07733e630839aa40b54bda914423cbcf288c5953c2ea84234056dfbe5e669db6';  //5,383,837
  await getInternalsFromBlock(blockHash);

  blockHash = '0x69189bcefe487544baab63800ad372920fa8099bf8487ea3d16d6d034a828da1';  // 6,193,845
  await getInternalsFromBlock(blockHash);

})();
