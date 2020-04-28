const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://35.221.208.98:8545'));

//const filter = web3.eth.filter("latest")
//filter.watch(function (error, blockHash) {
web3.eth.getBlock('0x69189bcefe487544baab63800ad372920fa8099bf8487ea3d16d6d034a828da1').then(async function(block) {
  console.log('Block #' + block.number);
  await _(block.transactions).each(async function(txHash) {
    console.log(txHash);
    let tx = await web3.eth.getTransaction(txHash).catch((e) => console.log('an error occured while getting the transaction'));
    let tr = await web3.eth.getTransactionReceipt(txHash);  // this one seems not returning well, promised?
    console.log(tx.value);
    console.log(`${tr.transactionIndex}: ${tx.from} -> ${tx.to} (${tx.value} wei, ${tr.cumulativeGasUsed} gas, ${tr.logs.length} event(s))`);
    //if (tr.contractAddress) {
    //  console.log('   Contract created at ' + tr.contractAddress);
    //}

    let tfs = await trace.getInternalTransfers(web3.currentProvider, txHash, tx.to);
    console.log(tfs);
    _(tfs).each(tf => {
      console.log(`  ${tf.senderAddress} -> ${tf.recipientAddress} (${tf.etherSent} wei)`);
    });
  });
}).catch(e => {
  console.log('an error occured:');
  console.log(e);
});
