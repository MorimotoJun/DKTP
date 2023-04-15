// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interface/IFT.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FT is ERC20, Ownable, IFT {
    /*************
     * MODIFIERS *
     *************/

    address treasury;
    
    modifier onlyTreasury() {
        require(msg.sender == treasury, "onlyTreasury");
        _;
    }

    modifier onlyOwnerOrTreasury() {
        require(
            msg.sender == treasury
            || msg.sender == owner(),
            "onlyOwnerOrTreasury"
        );
        _;
    }

    /***************
     * CONSTRUCTOR *
     ***************/

    constructor(address treasuryAddress) ERC20("MarketFT", "FT") {
        treasury = treasuryAddress;
    }

    function setTreasuryContract(address _treasuryContract) external onlyOwner {
        treasury = _treasuryContract;
    }

    /*************
     * FUNCTIONS *
     *************/

    function mint(address to, uint amount) public onlyOwnerOrTreasury {
        _mint(to, amount );
    }

    function burn(uint256 _amount) external onlyTreasury {
        _burn(msg.sender, _amount);
    }
}
