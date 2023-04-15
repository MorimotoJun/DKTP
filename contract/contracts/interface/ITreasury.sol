// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { TokenTypes } from "./IMarket.sol";

interface ITreasury {

    event Mint(uint tokenId, uint128 liquidity);
    /*************
     * FUNCTIONS *
     *************/

    function sendReward(address author, address user, uint256 amount) external;

    function setMarketContract(address marketAddress) external;

    function receiveSales(TokenTypes tokenType, uint256 amount) external;

    function burnToken() external;
}
