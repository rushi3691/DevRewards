require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "sepolia",

  networks:{
    sepolia:{
      url:process.env.RPC_ENDPOINT,
      accounts:[process.env.ACCOUNT_KEY]
    }
  }
};
