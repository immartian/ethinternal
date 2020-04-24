const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://104.154.88.76:8545'));

//const filter = web3.eth.filter("latest")
//filter.watch(function (error, blockHash) {
web3.eth.getBlock('0xf794ba1d268585af1776790753fe51f4be6d7852ff2c34012f8bad3572b17bc5').then(function(block) {

    var txHash = "0xa58006f32bdea97ad0ff8382fdfc6b0d7cf6361b37a9ecbfc8885d96ea1a9720"; 	// the tx for recent test
    //var txHash = "0x382fb82017033a1e8acd454c5a5155e609387b7d20c00b0053b19bf9ad9c4db8";   	// a history tx  from Ben

    web3.eth.getTransaction(txHash).then((tx) => {
     // web3.eth.getTransactionReceipt(txHash).then((tr) => {    // this one seems not returning well, promised?
        console.log(tx.value);
       // console.log(`${tr.transactionIndex}: ${tx.from} -> ${tx.to} (${tx.value} wei, ${tr.cumulativeGasUsed} gas, ${tr.logs.length} event(s))`);
        //if (tr.contractAddress) {
        //  console.log('   Contract created at ' + tr.contractAddress);
        //}

        trace.getInternalTransfers(web3.currentProvider, txHash, tx.to).then((tfs) => {
            console.log (tfs); 
	    /* _(tfs).each(tf => {
                console.log(`  ${tf.senderAddress} -> ${tf.recipientAddress} (${tf.etherSent} wei)`);
              });*/
            },
        );

      //}).catch((e) => {console.log(e);});
  });
});
