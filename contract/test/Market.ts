"use strict";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractEnum } from "../scripts/utils";

describe("Market Contract", function () {
    describe("listArticle", function () {
        it("should be listed successfully", async function () {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            const tx = await market.connect(user).issueTokenId();

            expect((await tx.wait()).events?.length).to.equal(1);
            // @ts-ignore
            expect((await tx.wait()).events[0].event).to.equal('Issue');
            // @ts-ignore
            expect((await tx.wait()).events[0].args.tokenId).to.equal('1');

            // @ts-ignore
            await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy', (await tx.wait()).events[0].args.tokenId);
        });

        it("should be rejected by nonEmptyCID", async function () {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            const tx = await market.connect(user).issueTokenId();

            let e = 'no error';
            try {
                // @ts-ignore
                await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), '', (await tx.wait()).events[0].args.tokenId);
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('cid should not be empty');
        });

        it("should be rejected by checkDup", async function () {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            let tx = await market.connect(user).issueTokenId();

            // @ts-ignore
            await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy', (await tx.wait()).events[0].args.tokenId);

            tx = await market.connect(user).issueTokenId();

            let e = 'no error';
            try {
                // @ts-ignore
                await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy', (await tx.wait()).events[0].args.tokenId);
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('the CID has already listerd');
        });

        it("should be rejected by the dup", async function () {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            let tx = await market.connect(user).issueTokenId();

            // @ts-ignore
            await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy', (await tx.wait()).events[0].args.tokenId);

            let e = 'no error';
            try {
                // @ts-ignore
                await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy1', (await tx.wait()).events[0].args.tokenId);
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('tokenId cannot duplicate');
        });

        it("should be rejected by the invalid tokenId", async function () {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            let e = 'no error';
            try {
                // @ts-ignore
                await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy1', '1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('invalid token id');
        });
    });

    describe('delistArticle', function() {
        it('should delist an article successfully', async function() {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(user).issueTokenId();
            await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy1', '2');
            await market.connect(user).listArticle(0, ethers.utils.parseEther('10'), 'dummy', '1');

            await market.connect(user).delistArticle('1');

            expect((await market.getArticle('2')).cid).to.equal('dummy1');

            let e = 'no error';
            try {
                await market.getArticle('1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('the tokenId does not exist');
        })

        it('should be rejected by not the author', async function() {
            const { market } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('10'), 'dummy', '1');

            let e = 'no error';
            try {
                await market.connect(user).delistArticle('1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('caller is not the author of this article');
        })

        it('should be rejected by non existence', async function() {
            const { market } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            let e = 'no error';
            try {
                await market.connect(user).delistArticle('1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('the tokenId does not exist');
        })
    })
    
    describe('purchaseArticle', function() {
        it('should purchase by matic successfully', async function() {
            const { market, nft, treasury } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');

            await market.connect(user).purchaseArticle('1', { value: ethers.utils.parseEther('1') });

            expect(await nft.balanceOf(user.address, '1')).to.equal('1');
            expect(await treasury.salesMaticAmount()).to.equal(ethers.utils.parseEther('0.05'));
            expect(await ethers.provider.getBalance(treasury.address)).to.equal(ethers.utils.parseEther('0.05'));
        })

        it('should purchase by ft successfully', async function() {
            const { market, nft, ft, treasury } = await loadFixture(deployFixture);
            const [owner, author, user] = await ethers.getSigners();

            await ft.connect(owner).mint(user.address, ethers.utils.parseEther('100'));

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(1, ethers.utils.parseEther('100'), 'dummy', '1');

            await ft.connect(user).approve(market.address, ethers.utils.parseEther('100'));

            await market.connect(user).purchaseArticle('1');

            expect(await nft.balanceOf(user.address, '1')).to.equal('1');
            expect(await treasury.salesFtAmount()).to.equal(ethers.utils.parseEther('5'));
            expect(await ft.balanceOf(treasury.address)).to.equal(ethers.utils.parseEther('5'));
        })

        it('should be rejected by non existence', async function() {
            const { market } = await loadFixture(deployFixture);
            const [,, user] = await ethers.getSigners();

            let e = 'no error';
            try {
                await market.connect(user).purchaseArticle('1');
            } catch (err: any) {
                e = err.message
            }

            expect(e).to.include('the tokenId does not exist');
        })

        it('should be rejected by matching author', async function() {
            const { market } = await loadFixture(deployFixture);
            const [, author] = await ethers.getSigners();

            await market.connect(author).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');

            let e = 'no error';
            try {
                await market.connect(author).purchaseArticle('1', { value: ethers.utils.parseEther('1') });
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('cannot buy your article yourselves')
        })

        it('should be rejected by insufficient msg.value', async function() {
            const { market, nft, treasury } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');

            let e = 'no error';
            try {
                await market.connect(user).purchaseArticle('1', { value: ethers.utils.parseEther('0.1') });
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('insufficient value for the price of the article')
        })

        it('should be rejected by existing msg.value', async function() {
            const { market, nft, ft, treasury } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(1, ethers.utils.parseEther('100'), 'dummy', '1');

            let e = 'no error';
            try {
                await market.connect(user).purchaseArticle('1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include("insufficient value for the article's price");
        })
    })

    describe('sendStar', function() {
        it('should sendStar successfully', async function() {
            const { market, nft, ft } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();

            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');

            await market.connect(user).purchaseArticle('1', { value: ethers.utils.parseEther('1') });

            const tx = await market.connect(user).sendStar('1');

            expect(await ft.balanceOf(author.address)).to.equal(ethers.utils.parseEther('0.007'))
            expect(await ft.balanceOf(user.address)).to.equal(ethers.utils.parseEther('0.003'))
            expect(await nft.balanceOf(user.address, '1')).to.equal('1');
            
            const txLog = await tx.wait();
            // @ts-ignore
            expect(txLog.events[2].event).to.equal('Star');
            // @ts-ignore
            expect(txLog.events[2].args.from).to.equal(user.address);
            // @ts-ignore
            expect(txLog.events[2].args.to).to.equal(author.address);
            // @ts-ignore
            expect(txLog.events[2].args.amount).to.equal(ethers.utils.parseEther('1'));
        })

        it('should be rejected by non NFT holder', async function() {
            const { market, nft, treasury } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();
    
            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');
    
            let e = 'no error';
            try {
                await market.connect(user).sendStar('1');
            } catch (err: any) {
                e = err.message;
            }
    
            expect(e).to.include('caller dose not have the article');
        })
    
        it('should be rejected by already sent', async function() {
            const { market, nft, treasury } = await loadFixture(deployFixture);
            const [, author, user] = await ethers.getSigners();
    
            await market.connect(user).issueTokenId();
            await market.connect(author).listArticle(0, ethers.utils.parseEther('1'), 'dummy', '1');
    
            await market.connect(user).purchaseArticle('1', { value: ethers.utils.parseEther('1') });
    
            await market.connect(user).sendStar('1');
    
            let e = 'no error';
            try {
                await market.connect(user).sendStar('1');
            } catch (err: any) {
                e = err.message;
            }
    
            expect(e).to.include("you've already sent star to this article");
        })
    })

    describe('getArticle', function() {
        it('should be rejected by non existence', async function() {
            const { market } = await loadFixture(deployFixture);

            let e = 'no error';

            try {
                await market.getArticle('1');
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('the tokenId does not exist')
        })
    })
});

// J : deploymentを重複実行しないための関数
// E : function not to deploy the same contract several times
async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory(ContractEnum.NFT, owner);
    const nft = await NFT.deploy();
    await nft.deployed();

    const Treasury = await ethers.getContractFactory(ContractEnum.Treasury, owner);
    const treasury = await Treasury.deploy();
    await treasury.deployed();

    const FT = await ethers.getContractFactory(ContractEnum.FT, owner);
    const ft = await FT.deploy(treasury.address);
    await ft.deployed();

    const Market = await ethers.getContractFactory(ContractEnum.Market, owner);
    const market = await Market.deploy(ft.address, nft.address, treasury.address);
    await market.deployed();
    
    await nft.connect(owner).setMarketContract(market.address);
    await treasury.connect(owner).setMarketContract(market.address);
    await treasury.connect(owner).setToken(ft.address);

    return { nft, treasury, ft, market };
}
