// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface ILiquidity {
    function onERC721Received(
        address operator,
        address from,
        uint tokenId,
        bytes calldata
    ) external pure returns (bytes4);

    function mintNewPosition(
        uint amount0ToAdd,
        uint amount1ToAdd
    ) external returns (uint tokenId, uint128 liquidity, uint amount0, uint amount1);

    function collectAllFees(
        uint tokenId
    ) external returns (uint amount0, uint amount1);

    function increaseLiquidityCurrentRange(
        uint tokenId,
        uint amount0ToAdd,
        uint amount1ToAdd
    ) external returns (uint128 liquidity, uint amount0, uint amount1);

    function decreaseLiquidityCurrentRange(
        uint tokenId,
        uint128 liquidity
    ) external returns (uint amount0, uint amount1);
}

