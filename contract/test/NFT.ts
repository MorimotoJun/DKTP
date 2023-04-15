"use strict";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractEnum, getAbi } from "../scripts/utils";

describe("NFT Contract", function () {
    describe('baseURI & uri & mintAndTransfer', function() {
        it('should be set successfully', async function() {
            const { contract, util } = await loadFixture(deployFixture);
            const [owner, market] = await ethers.getSigners();

            const data = util.encodeFunctionData('mintAndTransfer', ['3', 'dummy', owner.address]);
            await market.sendTransaction({
                from: market.address,
                to: contract.address,
                data,
            });

            expect(
                await contract.uri('3')
            ).to.equal('https://ipfs.io/ipfs/dummy');
        })

        it('should return tokenId', async function() {
            const { contract, util } = await loadFixture(deployFixture);
            const [owner, market] = await ethers.getSigners();

            const data = util.encodeFunctionData('mintAndTransfer', ['3', '', owner.address]);
            await market.sendTransaction({
                from: market.address,
                to: contract.address,
                data,
            });

            expect(
                await contract.uri('3')
            ).to.equal('https://ipfs.io/ipfs/');
        })
    })

    describe('mintAndTransfer', function() {
        it('should be rejected cuz of onlyMarket', async function() {
            const { contract } = await loadFixture(deployFixture);
            const [, market] = await ethers.getSigners();

            let e = 'no error';
            try {
                await contract.mintAndTransfer('3', 'dummy', market.address);
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('only the Marketplace can call this');
        })
    })

    describe('burn', function() {
        it('should burn successfully', async function() {
            const { contract, util } = await loadFixture(deployFixture);
            const [owner, market] = await ethers.getSigners();

            const data = util.encodeFunctionData('mintAndTransfer', ['3', 'dummy', owner.address]);
            await market.sendTransaction({
                from: market.address,
                to: contract.address,
                data,
            });

            expect(await contract.balanceOf(owner.address, '3'))
                .to.equal(1);

            await contract.burn(owner.address, ['3'], ['1']);
            expect(await contract.balanceOf(owner.address, '3'))
                .to.equal(0);
        })

        it('should be rejected cuz of the ownership', async function() {
            const { contract, util } = await loadFixture(deployFixture);
            const [owner, market] = await ethers.getSigners();

            const data = util.encodeFunctionData('mintAndTransfer', ['3', 'dummy', owner.address]);
            await market.sendTransaction({
                from: market.address,
                to: contract.address,
                data,
            });

            expect(await contract.balanceOf(owner.address, '3'))
                .to.equal(1);

            let e = 'no error';
            try {
                const data = util.encodeFunctionData('burn', [
                    owner.address, ['3'], ['1']
                ]);
                await market.sendTransaction({
                    from: market.address,
                    to: contract.address,
                    data,
                });
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('caller is not the token owner');
        })
    })

    describe('transferFrom', function() {
        it('should be rejected', async function() {
            const { contract, util } = await loadFixture(deployFixture);
            const [owner, market] = await ethers.getSigners();

            const data = util.encodeFunctionData('mintAndTransfer', ['3', 'dummy', owner.address]);
            await market.sendTransaction({
                from: market.address,
                to: contract.address,
                data,
            });

            let e = 'no error';
            try {
                await contract.safeTransferFrom(
                    owner.address,
                    market.address,
                    '3',
                    '1',
                    '0x'
                );
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('this is un-transferable token');
        })
    })
});

// J : deploymentを重複実行しないための関数
// E : function not to deploy the same contract several times
async function deployFixture() {
    const [owner, market] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(ContractEnum.NFT, owner);
    const contract = await Contract.deploy();
    await contract.deployed();
    await contract.connect(owner).setMarketContract(market.address);

    const { abi } = getAbi(ContractEnum.NFT);
    const util = new ethers.utils.Interface(abi);

    return {
        contract, util,
    };
}