const _ = require('lodash');

const trace = require('./transactionTrace');

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://104.154.88.76:8545'));

//const filter = web3.eth.filter("latest")
//filter.watch(function (error, blockHash) {
web3.eth.getBlock('0xf794ba1d268585af1776790753fe51f4be6d7852ff2c34012f8bad3572b17bc5').then(function(block) {

});


contractAddress = "0x00.."
web3.eth.filter({
address: contractAddress
from: 1,
to: 'latest'
}).get(function (err, result) {
// callback code here
})
