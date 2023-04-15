"use strict";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractEnum } from "../scripts/utils";

describe("FT Contract", function() {
    describe("mint", function() {
        it("should be successful by owner", async function() {
            const { ft, owner } = await loadFixture(deployFixture);

            expect(await ft.connect(owner).mint(owner.address, ethers.utils.parseEther("1")));
        });
        it("should be successful by treasury", async function() {
            const { ft, treasury } = await loadFixture(deployFixture);

            expect(await ft.connect(treasury).mint(treasury.address, ethers.utils.parseEther("1")));
        });
        it("should be rejected by not owner or treasury", async function() {
            const { ft } = await loadFixture(deployFixture);
            const [ ,,user ] = await ethers.getSigners();

            await expect(ft.connect(user).mint(user.address, ethers.utils.parseEther("1"))).to.be.rejectedWith("caller should be only owner or treasury");
        })
    })
    describe("burn", function() {
        it("should be successful by treasury", async function() {
            const { ft, treasury } = await loadFixture(deployFixture);

            await ft.connect(treasury).mint(treasury.address, ethers.utils.parseEther('1'));

            expect(await ft.connect(treasury).burn(ethers.utils.parseEther("1")));
        });
        it("should be rejected by not treasury", async function() {
            const { ft, treasury } = await loadFixture(deployFixture);
            const [ ,,user ] = await ethers.getSigners();

            await ft.connect(treasury).mint(user.address, ethers.utils.parseEther('1'));

            await expect(ft.connect(user).burn(ethers.utils.parseEther("1"))).to.be.rejectedWith("caller should be only treasury");
        })
    })
})

async function deployFixture() {
    const [ owner, treasury ] = await ethers.getSigners();

    const FT = await ethers.getContractFactory(ContractEnum.FT, owner);
    const ft = await FT.deploy(treasury.address);
    await ft.deployed();

    return { ft, owner, treasury };
}
