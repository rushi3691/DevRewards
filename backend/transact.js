
const ACCOUNT_KEY = process.env.ACCOUNT_KEY;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
if (!ACCOUNT_KEY) {
  throw new Error('Account private key not provided in env file');
}

if (!RPC_ENDPOINT) {
  throw new Error('RPC endpoint not provided in env file');
}

const { Contract, ethers, Wallet } =require('ethers');

const {CONTRACT_ADDRESS, CONTRACT_ABI} = require('./constants');

const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
const signer = new Wallet(ACCOUNT_KEY, provider);

const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

async function setUser(address, name, email, user_id, installation_id) {
  console.log(address, name, email, user_id, installation_id)
  // console.log(typeof address, typeof name, typeof email, typeof user_id, typeof installation_id)
  const unsignedTrx = await contractInstance.populateTransaction.addUser(
    address, name, email, user_id, installation_id
  );
  console.log('Transaction created');

  const trxResponse = await signer.sendTransaction(unsignedTrx);
  console.log(`Transaction sent: ${trxResponse.hash}`);
  // wait for block
  await trxResponse.wait(1);
  console.log(
    `Proposal has been mined at blocknumber: ${trxResponse.blockNumber}, transaction hash: ${trxResponse.hash}`
  );
}


async function sendReward(userId, repoId, label){
  console.log(userId, repoId, label)
  const unsignedTrx = await contractInstance.populateTransaction.commitOccured(
    userId, repoId, label
  );
  console.log('Transaction created');

  const trxResponse = await signer.sendTransaction(unsignedTrx);
  console.log(`Transaction sent: ${trxResponse.hash}`);
  // wait for block
  await trxResponse.wait(1);
  console.log(
    `Proposal has been mined at blocknumber: ${trxResponse.blockNumber}, transaction hash: ${trxResponse.hash}`
  );
}
// trigger sendTransaction function
// exports.setUser = setUser;
module.exports = { setUser, sendReward };