const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://35.221.208.98:8545'));
// first: 35.221.208.98
//another endpoint:   35.200.37.219

// How to use?
// either run node trace.js transaction [txid] to see internal transactions for 1 transaction
// or run node trace.js block [blockhash] to see transactions from the provided block

function convert(n) {
  var sign = +n < 0 ? '-' : '',
      toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n.toString()
      .replace(/^-/, '')
      .replace(/^([0-9]+)(e.*)/, '$1.$2')
      .split(/e|\./);
  return +pow < 0
      ? sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
      : sign + lead + (+pow >= decimal.length ? (decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))) : (decimal.slice(0, +pow) + '.' + decimal.slice(+pow)));
}

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

    await getInternalTransaction(txHash);
  }
}

async function getInternalTransaction(txHash) {
  console.log('Transaction hash: ' + txHash);
  console.log('Internal transactions');
  let tx = await web3.eth.getTransaction(txHash).catch((e) => console.log('an error occured while getting the transaction'));

  let tfs = await trace.getInternalTransfers(web3.currentProvider, txHash, tx.to);
  // console.log(tfs);
  _(tfs).each(tf => {
    let weiAmount = convert(tf.etherSent);
    let musicoinAmount = web3.utils.fromWei(weiAmount, 'ether');
    console.log(`  ${tf.senderAddress} -> ${tf.recipientAddress} (${musicoinAmount} MUSIC)`);
  });
}

(async () => {

  console.log(process.argv[2]);

  if (process.argv[2] === 'transaction') {
    let transactionHash = process.argv[3];
    await getInternalTransaction(transactionHash);
  }

  if (process.argv[2] === 'block') {
    let blockHash = process.argv[3];
    await getInternalsFromBlock(blockHash);
  }

})();
