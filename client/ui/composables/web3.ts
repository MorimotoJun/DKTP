import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { MARKET_CONTRACT_ADDRESS } from './const';
import { getProvider, getCurrentAddress } from './metamask';
import MarketContract from '~/assets/artifacts/contracts/Market.sol/Market.json';

const NO_CONNECTION_ERROR = new Error("need to connect()")

export class Market {
    contract: Contract | undefined;
    web3:any

    constructor(){
        this.contract = undefined;
    }

    async connect(): Promise<this> {
        const web3 = new Web3(await getProvider());
        this.web3 = web3;
        // @ts-ignore
        this.contract = new web3.eth.Contract(MarketContract.abi, MARKET_CONTRACT_ADDRESS);
        return this;
    }

    async incrementTokenId(): Promise<number> {
        if (this.contract == undefined) {
            throw NO_CONNECTION_ERROR;
        }
        let tokenId;
        const userAddr = await getCurrentAddress();
        await this.contract?.methods.issueTokenId().send({from: userAddr}).on('receipt', function(receipt: any){
            tokenId = receipt.events.Issue.returnValues.tokenId;
        })
        if (tokenId == undefined) {
            throw new Error("could not receive tokenId");
        }
        // @ts-ignore
        return tokenId;
    }

    async listArticle(tokenId: number, tokenType: number, price: number, cid: string): Promise<number> {
        if (this.contract == undefined) {
            throw NO_CONNECTION_ERROR;
        }
        const wei = this.web3.utils.toWei(price.toString());
        const userAddr = await getCurrentAddress();
        await this.contract?.methods.listArticle(tokenType,wei,cid,tokenId).send({from: userAddr});
        // @ts-ignore
        return tokenId;
    }

    async delistArticle(tokenId: number): Promise<void>{
        if (this.contract == undefined) {
            throw NO_CONNECTION_ERROR;
        }
        const userAddr = await getCurrentAddress();
        await this.contract?.methods.delistArticle(tokenId).send({from: userAddr});
    }

    async purchaseArticle(tokenId: number, price: number): Promise<void> {
        if (this.contract == undefined) {
            throw NO_CONNECTION_ERROR;
        }

        const wei:string = this.web3.utils.toWei(price.toString());
        const userAddr = await getCurrentAddress();
        await this.contract?.methods.purchaseArticle(tokenId).send({from: userAddr, value: wei}).on('receipt', function(receipt: any){
        return receipt;
        });
    }

    async sendStar(tokenId: number): Promise<void>{
        if (this.contract == undefined) {
            throw NO_CONNECTION_ERROR;
        }
        const userAddr = await getCurrentAddress();
        await this.contract?.methods.sendStar(tokenId).send({from: userAddr});
    }
}
export const getMarketContract = async function(): Promise<Contract>{
    const web3 = new Web3(await getProvider());
    // @ts-ignore
    const contract = new web3.eth.Contract(Market.abi, MARKET_CONTRACT_ADDRESS);
    return contract
}

export const incrementTokenId = async function(contract: Contract): Promise<number> {
    let tokenId;
    const userAddr = await getCurrentAddress();
    await contract.methods.issueTokenId().send({from: userAddr}).on('receipt', function(receipt: any){
        tokenId = receipt.events.Issue.returnValues.tokenId;
    })
    if (tokenId == undefined) {
        throw new Error("could not receive tokenId");
    }
    // @ts-ignore
    return tokenId;
}

export const listArticle = async function(contract: Contract, tokenId: number, tokenType: number, price: number, cid: string ): Promise<number> {
    const userAddr = await getCurrentAddress();
    await contract.methods.listArticle(tokenType,price,cid,tokenId).send({from: userAddr});
    // @ts-ignore
    return tokenId;
}

export const purchaseArticle = async function (contract: Contract, tokenId: number, price: number): Promise<any> {
    const userAddr = await getCurrentAddress();
    await contract.methods.purchaseArticle(tokenId).send({from: userAddr, value: price});
}
