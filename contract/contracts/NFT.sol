// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/INFT.sol";

contract NFT is ERC1155, Ownable, INFT {
    using Strings for uint256;

    /*************
     * CONSTANTS *
     *************/

    // Optional base URI
    string private _baseURI = "";

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // symbol
    string public symbol = "DKTP";

    // name
    string public name = "DKTP NFT";

    // external Market Contract
    address public marketContract;

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

    constructor() ERC1155("https://ipfs.io/ipfs/") {
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    function setMarketContract(address marketAddress) public onlyOwner {
        marketContract = marketAddress;
    }

    /**********************
     * INTERNAL FUNCTIONS *
     **********************/

     function _setTokenURI(uint256 tokenId, string memory tokenURI) internal virtual  {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function _setBaseURI(string memory baseURI) internal virtual  {
        _baseURI = baseURI;
    }

    function _beforeTokenTransfer(
        address ,
        address from,
        address to,
        uint256[] memory ,
        uint256[] memory ,
        bytes memory
    ) internal pure override {
        require(
            from==address(0) || to==address(0),
            "this is un-transferable token"
        );
    }

    /*************
     * FUNCTIONS *
     *************/

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        // If token URI is set, concatenate base URI and tokenURI (via abi.encodePacked).
        return bytes(tokenURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenURI)) : super.uri(tokenId);
    }

    function mintAndTransfer(uint256 tokenId, string memory tokenUri, address recipient) external onlyMarket {
        _mint(recipient, tokenId, 1, '');
        _setTokenURI(tokenId, tokenUri);
    }

    function burn(address from, uint256[] memory tokenIds, uint256[] memory amounts) external {
        require(
            from == _msgSender(),
            "caller is not the token owner"
        );
        _burnBatch(from, tokenIds, amounts);
    }
}
