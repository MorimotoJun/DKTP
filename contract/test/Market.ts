import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import { ethers, web3 } from "hardhat";
import { ContractEnum, getAbi, TokenType } from "../scripts/utils";

describe("Market", function () {
  describe("listArticle", function () {
    it("should be succeeded with multiple request", async function () {
      const { market } = await loadFixture(deployFixture);

      const [ user1, user2 ] = await web3.eth.getAccounts();
      const listArticleInputs = [{ tokenType: TokenType.MATIC, price:100, cid: "test", user: user1 }, { tokenType: TokenType.FT, price:200, cid: "test2", user: user2 }];

      await listArticles(market, listArticleInputs);

      for (let i = 0; i < listArticleInputs.length; i++){
        const _article = listArticleInputs[i];
        const article = await market.methods.getArticle(i).call();
        expect(article.tokenType).to.equal(String(_article.tokenType));
        expect(article.price).to.equal(ethers.BigNumber.from(_article.price));
        expect(article.cid).to.equal(_article.cid);
        expect(article.author).to.equal(_article.user);
      }
    });
  });

  describe("delistArticle", function () {
    it("should be succeeded to delist an article", async function () {
      const { market } = await loadFixture(deployFixture);

      const [ user1, user2 ] = await web3.eth.getAccounts();
      const listArticleInputs = [{ tokenType: TokenType.MATIC, price:100, cid: "test", user: user1 }, { tokenType: TokenType.FT, price:200, cid: "test2", user: user2 }];

      const tokenIdForDelist = 0;
      let article;

      expect(await listArticles(market, listArticleInputs));
      expect(await market.methods.getArticle(tokenIdForDelist).call());

      // delist
      const func = await market.methods.delistArticle(tokenIdForDelist);
      expect(await func.send({
        from: listArticleInputs[tokenIdForDelist].user,
        gas: "10000000",
      }).on('receipt', function () {
        func.call().then(function (returned: string) {
            expect(returned).to.equal(null);
        });
      }));

      await expect(market.methods.getArticle(tokenIdForDelist).call()).to.be.rejectedWith("tokenId data is not found");

      article = await market.methods.getArticle(1).call();
      const _article = listArticleInputs[1];
      expect(article.tokenType).to.equal(String(_article.tokenType));
      expect(article.price).to.equal(ethers.BigNumber.from(_article.price));
      expect(article.cid).to.equal(_article.cid);
      expect(article.author).to.equal(_article.user);

    });
  });
})

interface ITestListArticleInput {
  tokenType: number;
  price: number;
  cid: string;
  user: string;
}

async function deployFixture() {
  const [owner] = (await web3.eth.getAccounts()).slice(-1);

    let marketAddress: string;
    const MarketContract = await getAbi(ContractEnum.Market);
    const contractInstance = new web3.eth.Contract(MarketContract.abi);
    const deployTx = contractInstance.deploy({ data: MarketContract.bytecode });
    const market = await deployTx.send({ from: owner, gas: 0 }).on('receipt', function(receipt: any){
      marketAddress = receipt.contractAddress;
    });

    return { market, owner };
  }

async function listArticles(market: web3.eth.Contract, listArticleInputs: ITestListArticleInput[]) {
  for (let i = 0; i < listArticleInputs.length; i++){
    const _article = listArticleInputs[i];
    const func = await market.methods.listArticle(_article.tokenType, _article.price, _article.cid);
    await func.send({
        from: _article.user,
        gas: "10000000",
    }).on('receipt', function () {
      func.call().then(function (returned: string) {
          expect(returned).to.equal(String(2), "should return expected tokenId");
      });
    });
  };
};
