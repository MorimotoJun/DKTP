// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interface/IFT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract FT is ERC20, Ownable, IFT {
    address treasury;

    modifier onlyTreasury() {
        require(msg.sender == treasury, "caller should be only treasury");
        _;
    }

    modifier onlyOwnerOrTreasury() {
        require(
            msg.sender == treasury
            || msg.sender == owner(),
            "caller should be only owner or treasury"
        );
        _;
    }

    constructor(address treasuryAddress) ERC20("MarketFT", "FT") {
        treasury = treasuryAddress;
    }

    function mint(address to, uint amount) public onlyOwnerOrTreasury {
        _mint(to, amount);
    }

    function burn(uint256 _amount) external onlyTreasury {
        _burn(msg.sender, _amount);
    }
}
