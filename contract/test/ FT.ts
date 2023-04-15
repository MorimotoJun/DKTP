"use strict";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractEnum } from "../scripts/utils";

describe('FT Contract', function() {
    describe('setTreasuryContract', function() {
        it('should set successfully', async function() {
            const { ft } = await loadFixture(deployFixture);
            const [owner,, newTreasury] = await ethers.getSigners();

            await ft.connect(owner).setTreasuryContract(newTreasury.address);

            await ft.connect(newTreasury).mint(newTreasury.address, ethers.utils.parseEther('1'));
            await ft.connect(newTreasury).burn(ethers.utils.parseEther('0.5'));

            expect(await ft.balanceOf(newTreasury.address)).to.equal(ethers.utils.parseEther('0.5'))
        });

        it('should be rejected by onlyOwner', async function() {
            const { ft } = await loadFixture(deployFixture);
            const [, user, newTreasury] = await ethers.getSigners();

            let e = 'no error';
            try {
                await ft.connect(user).setTreasuryContract(newTreasury.address);
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('Ownable: caller is not the owner');
        })
    })

    describe('mint', function() {
        it('should be rejected by onluOwnerOrTreasury', async function() {
            const { ft } = await loadFixture(deployFixture);
            const [, user] = await ethers.getSigners();

            let e = 'no error';
            try {
                await ft.connect(user).mint(user.address, ethers.utils.parseEther('1'));
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('onlyOwnerOrTreasury');
        })
    })

    describe('burn', function() {
        it('should be rejected by onlyTreasury', async function() {
            const { ft } = await loadFixture(deployFixture);
            const [owner,, newTreasury] = await ethers.getSigners();

            await ft.connect(owner).mint(newTreasury.address, ethers.utils.parseEther('1'));

            let e = 'no error';
            try {
                await ft.connect(newTreasury).burn(ethers.utils.parseEther('0.5'));
            } catch (err: any) {
                e = err.message;
            }
            expect(e).to.include('onlyTreasury');
        })
    })
})

// J : deploymentを重複実行しないための関数
// E : function not to deploy the same contract several times
async function deployFixture() {
    const [owner, market] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory(ContractEnum.Treasury, owner);
    const treasury = await Treasury.deploy();
    await treasury.deployed();

    const FT = await ethers.getContractFactory(ContractEnum.FT, owner);
    const ft = await FT.deploy(treasury.address);
    await ft.deployed();
    
    await treasury.connect(owner).setMarketContract(market.address);
    await treasury.connect(owner).setToken(ft.address);

    return { treasury, ft };
}