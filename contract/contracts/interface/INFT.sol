// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface INFT is IERC1155 {
    /*************
     * FUNCTIONS *
     *************/

    function mintAndTransfer(uint256 tokenId, string memory tokenUri, address recipient) external;
}
