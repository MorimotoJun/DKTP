import "dotenv/config";
import { ethers, network } from "hardhat";
import { ContractEnum, getAbi } from "./utils";

// deploy local network
async function main() {
    let owner;
    if (network.name == "mumbai") {
      if (process.env.OWNER_SECRET_KEY == "") {
        console.error("OWNER_SECRET_KEY is missing");
      }
      const OWNER_SECRET_KEY = process.env.OWNER_SECRET_KEY;
      // @ts-ignore
      const provider = new ethers.providers.JsonRpcProvider(network.config.url);
      // @ts-ignore
      owner = new ethers.Wallet(OWNER_SECRET_KEY, provider);
    } else {
      [owner] = await ethers.getSigners();
    }

    // // deploy treasury
    // const Treasury = await ethers.getContractFactory(ContractEnum.Treasury,owner);
    // const treasury = await Treasury.deploy();
    // await treasury.deployed();
    // console.log("treasury deployed: ", treasury.address);

    // // deploy ft
    // const FT = await ethers.getContractFactory(ContractEnum.FT,owner);
    // const ft = await FT.deploy(treasury.address);
    // await ft.deployed();
    // console.log("ft deployed: ", ft.address);

    // // set FT contract to the Treasury
    // await treasury.setToken(ft.address);
    // console.log("set ft contract at treasury is done");

    // // deploy nft
    // const NFT = await ethers.getContractFactory(ContractEnum.NFT,owner);
    // const nft = await NFT.deploy();
    // await nft.deployed();
    // console.log("nft deployed: ", nft.address);

    // // deploy market
    // const Market = await ethers.getContractFactory(ContractEnum.Market, owner);
    // const market = await Market.deploy(ft.address, nft.address, treasury.address);
    // await market.deployed();
    // console.log("market deployed: ", market.address);

    // // set Market contract to the Treasury
    // await treasury.setMarketContract(market.address);
    // console.log("set market contract at treasury is done");

    // // set market address at nft contract
    // await nft.connect(owner).setMarketContract(market.address);
    // const nftMarketAddress = await nft.connect(owner).marketContract();
    // console.log("set market contract at nft is done: ", market.address == nftMarketAddress);

    const Liquidity = await ethers.getContractFactory(ContractEnum.UniswapV3Liquidity, owner);
    const liquidity = await Liquidity.deploy();
    console.log('Liquidity Contract deployed :', liquidity.address);

    const { abi } = getAbi(ContractEnum.Treasury)
    const treasury = new ethers.Contract('0x68026f8d546543A9bd96015494c96e9F360B1677', abi);
    await treasury.connect(owner).setLiquidityContract(liquidity.address);

    process.exit();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

