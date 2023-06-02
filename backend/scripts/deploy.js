// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs")
const path = require("path")
async function main() {

  const testContract = await hre.ethers.getContractFactory("OrganisationRepo");
  const test = await testContract.deploy(5);

  await test.deployed();
  
  const file = path.resolve(path.dirname(__dirname) + "/constants.js")
  const data = `const CONTRACT_ADDRESS = "${test.address}"`
  const abi = `const CONTRACT_ABI = ${test.interface.format(ethers.utils.FormatTypes.json)}`
  const constants = data + "\n" + abi
  const content = constants + "\n" + "module.exports = {CONTRACT_ADDRESS, CONTRACT_ABI};"
  fs.writeFileSync(file, content);


  // print abi interface
  console.log(
    `contract deployed to ${test.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
