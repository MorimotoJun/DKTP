// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFT is IERC20 {
    function mint(address to, uint amount) external;

    function burn(uint256 _amount) external;
}
