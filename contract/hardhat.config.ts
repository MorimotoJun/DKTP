import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";


const MUMBAI_RPC = process.env.MUMBAI_RPC || '';

const conf: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    local: { url: "http://127.0.0.1:8545/" },
    mumbai: { url: MUMBAI_RPC },
  },
};

export default conf;
