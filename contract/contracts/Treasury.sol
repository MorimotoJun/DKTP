// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IWMATIC, WMATIC } from "./Liquidity.sol";
import { ILiquidity } from "./interface/ILiquidity.sol";
import "./interface/ITreasury.sol";
import "./interface/IFT.sol";


contract Treasury is Ownable, ITreasury {
    /*************
     * CONSTANTS *
     *************/

    // external Market Contract
    address public marketContract;

    ILiquidity public liquidityContract;
    IWMATIC public wmatic = IWMATIC(WMATIC);
    IFT ft;

    uint256 public salesFtAmount;
    uint256 public salesMaticAmount;

    /*************
     * MODIFIERS *
     *************/

    modifier onlyMarket() {
        require(msg.sender == marketContract, "only the Marketplace can call this");
        _;
    }

    /***************
     * CONSTRUCTOR *
     ***************/

    receive() external payable {}

    fallback() external payable {}

    function setToken(IFT ftContractAddress) external onlyOwner {
        ft = ftContractAddress;
    }

    function setMarketContract(address marketAddress) external onlyOwner {
        marketContract = marketAddress;
    }

    function setLiquidityContract(ILiquidity liquidity) external onlyOwner {
        liquidityContract = liquidity;
    }

    /*************
     * FUNCTIONS *
     *************/

    function sendReward(address author, address user, uint256 amount) external onlyMarket {
        uint authorReward = amount / 10 * 7;
        uint userReward = amount / 10 * 3;
        ft.mint(author, authorReward);
        ft.mint(user, userReward);
    }

    function withdrawFT(address to, uint256 amount) external onlyMarket {
        ft.transfer(to, amount);
    }

    function receiveSales(TokenTypes tokenType, uint256 amount) external onlyMarket {
        if(tokenType==TokenTypes.Matic) { salesMaticAmount += amount; }
        else { salesFtAmount += amount; }
    }

    function burnToken() external onlyOwner {
        ft.burn(salesFtAmount);
        salesFtAmount = 0;
    }

    function mintLiquidity() external onlyOwner {
        require(address(this).balance > 150000000000000000, "insufficient sales");
        
        uint256 amount = address(this).balance - 150000000000000000;
        
        wmatic.deposit{ value: amount }();

        ft.mint(address(this), amount);

        salesMaticAmount = address(this).balance;

        ft.approve(address(liquidityContract), amount);
        wmatic.approve(address(liquidityContract), amount);

        (uint tokenId, uint128 liquidity,, ) = liquidityContract.mintNewPosition(amount, amount);

        emit Mint( tokenId, liquidity );
    }

    function provideLiquidity(uint256 tokenId) external onlyOwner {
        require(address(this).balance > 150000000000000000, "insufficient sales");
        
        uint256 amount = address(this).balance - 150000000000000000;
        
        wmatic.deposit{ value: amount }();

        ft.mint(address(this), amount);

        ft.approve(address(liquidityContract), amount);
        wmatic.approve(address(liquidityContract), amount);

        liquidityContract.increaseLiquidityCurrentRange(tokenId, amount, amount);
    }
}
