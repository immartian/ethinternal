const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://104.154.88.76:8545'));

//const filter = web3.eth.filter("latest")
//filter.watch(function (error, blockHash) {
web3.eth.getBlock('0xa728b5495f55f3cdba5ee5f09cdf195726c4e77541ca35232935b221d50c3601').then(function(block) {
  console.log('Block #' + block.number);
  _(block.transactions).each(txHash => {
    console.log(txHash); 
    web3.eth.getTransaction(txHash).then((tx) => {
     // web3.eth.getTransactionReceipt(txHash).then((tr) => {    // this one seems not returning well, promised?
        console.log(tx.value);
       // console.log(`${tr.transactionIndex}: ${tx.from} -> ${tx.to} (${tx.value} wei, ${tr.cumulativeGasUsed} gas, ${tr.logs.length} event(s))`);
        //if (tr.contractAddress) {
        //  console.log('   Contract created at ' + tr.contractAddress);
        //}

        trace.getInternalTransfers(web3.currentProvider, txHash, tx.to).then((tfs) => {
            //console.log (tfs); 
	    /* _(tfs).each(tf => {
                console.log(`  ${tf.senderAddress} -> ${tf.recipientAddress} (${tf.etherSent} wei)`);
              });*/
            },
        );

      //}).catch((e) => {console.log(e);});
    }).catch((e) => console.log('an error occured while getting the transaction'));
  });
});
