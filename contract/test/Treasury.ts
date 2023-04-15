"use strict";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { web3 } from "hardhat";
import { ContractEnum, getAbi } from "../scripts/utils";

describe('Treasury Contract', function() {
    describe('setToken', function() {
        it('should be rejected by onlyOwner', async function() {
            const [, user] = await web3.eth.getAccounts();
            const { treasury, ft } = await loadFixture(deployContracts);
            let e = 'no error';
            try {
                await treasury.methods.setToken(ft.options.address).send({
                    from: user,
                    gas: await treasury.methods.setToken(ft.options.address).estimateGas({
                        from: user
                    })
                })
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('Ownable: caller is not the owner');
        })
    })
    
    describe('setMarketContract', function() {
        it('should be rejected by onlyOwner', async function() {
            const [, user, market] = await web3.eth.getAccounts();
            const { treasury } = await loadFixture(deployContracts);
            let e = 'no error';
            try {
                await treasury.methods.setMarketContract(market).send({
                    from: user,
                    gas: await treasury.methods.setMarketContract(market).estimateGas({
                        from: user
                    })
                })
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('Ownable: caller is not the owner');
        })
    })

    describe('withdrawFT', function() {
        it('should withdraw FT successfully', async function() {
            const [ owner, user, market ] = await web3.eth.getAccounts();
            const { treasury, ft } = await loadFixture(deployContracts);

            await treasury.methods.withdrawFT(user, web3.utils.toWei('10')).send({
                from: market,
                gas: await treasury.methods.withdrawFT(user, web3.utils.toWei('10')).estimateGas({
                    from: market,
                })
            })

            expect(await ft.methods.balanceOf(user).call()).to.equal(web3.utils.toWei('10'));
            expect(await ft.methods.balanceOf(treasury.options.address).call()).to.equal(web3.utils.toWei('990'));
        })

        it('should be rejected by onlyMarket', async function() {
            const [ , user,, dummyMarket ] = await web3.eth.getAccounts();
            const { treasury } = await loadFixture(deployContracts);

            let e = 'no error';
            try {
                await treasury.methods.withdrawFT(user, web3.utils.toWei('10')).send({
                    from: dummyMarket,
                    gas: await treasury.methods.withdrawFT(user, web3.utils.toWei('10')).estimateGas({
                        from: dummyMarket,
                    })
                })
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('only the Marketplace can call this');
        })
    })

    describe('receiveSales', function() {
        it('should receive successfully', async function() {
            const [ ,, market ] = await web3.eth.getAccounts();
            const { treasury } = await loadFixture(deployContracts);

            await treasury.methods.receiveSales('0', web3.utils.toWei('30')).send({
                from: market,
                gas: await treasury.methods.receiveSales('0', web3.utils.toWei('30')).estimateGas({
                    from: market
                })
            });

            expect(await treasury.methods.salesMaticAmount().call()).to.equal(web3.utils.toWei('30'));

            await treasury.methods.receiveSales('1', web3.utils.toWei('50')).send({
                from: market,
                gas: await treasury.methods.receiveSales('1', web3.utils.toWei('50')).estimateGas({
                    from: market
                })
            });

            expect(await treasury.methods.salesFtAmount().call()).to.equal(web3.utils.toWei('50'));
        })

        it('should be rejected by onlyMarket', async function() {
            const [ , user ] = await web3.eth.getAccounts();
            const { treasury } = await loadFixture(deployContracts);

            let e = 'no error';
            try {
                await treasury.methods.receiveSales('1', web3.utils.toWei('50')).send({
                    from: user,
                    gas: await treasury.methods.receiveSales('1', web3.utils.toWei('50')).estimateGas({
                        from: user
                    })
                });
            } catch (err: any) {
                e = err.message;
            }
            expect(e).to.include('only the Marketplace can call this');
        })
    })

    describe('burnToken', function() {
        it('should burn successfully', async function() {
            const [ owner,, market ] = await web3.eth.getAccounts();
            const { treasury, ft } = await loadFixture(deployContracts);

            await treasury.methods.receiveSales('1', web3.utils.toWei('30')).send({
                from: market,
                gas: await treasury.methods.receiveSales('1', web3.utils.toWei('30')).estimateGas({
                    from: market
                })
            });

            expect(await ft.methods.balanceOf(treasury.options.address).call()).to.equal(web3.utils.toWei('1000'));

            await treasury.methods.burnToken().send({
                from: owner,
                gas: await treasury.methods.burnToken().estimateGas({
                    from: owner,
                })
            });

            expect(await ft.methods.balanceOf(treasury.options.address).call()).to.equal(web3.utils.toWei('970'));
            expect(await treasury.methods.salesFtAmount().call()).to.equal(web3.utils.toWei('0'));
        })

        it('should be rejected by onlyOwner', async function() {
            const [ ,, market ] = await web3.eth.getAccounts();
            const { treasury, ft } = await loadFixture(deployContracts);

            await treasury.methods.receiveSales('1', web3.utils.toWei('30')).send({
                from: market,
                gas: await treasury.methods.receiveSales('1', web3.utils.toWei('30')).estimateGas({
                    from: market
                })
            });

            expect(await ft.methods.balanceOf(treasury.options.address).call()).to.equal(web3.utils.toWei('1000'));

            let e = 'no error';
            try {
                await treasury.methods.burnToken().send({
                    from: market,
                    gas: await treasury.methods.burnToken().estimateGas({
                        from: market,
                    })
                });
            } catch (err: any) {
                e = err.message;
            }

            expect(e).to.include('Ownable: caller is not the owner')
        })
    })
})


async function deployContracts() {
    const [owner,,market] = await web3.eth.getAccounts();
    let { abi, bytecode: data } = getAbi(ContractEnum.Treasury);

    let treasury = new web3.eth.Contract(abi);

    await treasury
        .deploy({ data })
        .send({
            from: owner,
            gas: await treasury
                .deploy({ data })
                .estimateGas({ from: owner }),
        })
        .then(function (cont) {
            treasury = cont;
        });

    abi = getAbi(ContractEnum.FT).abi;
    data = getAbi(ContractEnum.FT).bytecode;

    let ft = new web3.eth.Contract(abi);

    await ft
        .deploy({ data, arguments: [ treasury.options.address ] })
        .send({
            from: owner,
            gas: await ft
                .deploy({ data, arguments: [ treasury.options.address ] })
                .estimateGas({ from: owner }),
        })
        .then(function (cont) {
            ft = cont;
        });

    await treasury.methods.setToken(ft.options.address).send({
        from: owner,
        gas: await treasury.methods.setToken(ft.options.address).estimateGas({
            from: owner,
        })
    });

    await treasury.methods.setMarketContract(market).send({
        from: owner,
        gas: await treasury.methods.setMarketContract(market).estimateGas({
            from: owner
        })
    });

    await ft.methods.mint(treasury.options.address, web3.utils.toWei("1000")).send({
        from: owner,
        gas: await ft.methods.mint(treasury.options.address, web3.utils.toWei("1000")).estimateGas({
            from: owner
        })
    });

    return { treasury, ft }
}
