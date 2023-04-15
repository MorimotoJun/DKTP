// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/Enum.sol";


contract Market is Ownable {
    struct Article {
        TokenType tokenType;
        uint price;
        string cid;
        address payable author;
    }

    event Star( address indexed from, address indexed to, uint256 amount);

    mapping (uint => Article) articles;
    uint nextTokenId;

    modifier validCID(string memory _cid) {
        // TODO: add more logic
        require(keccak256(abi.encodePacked(_cid)) != keccak256(abi.encodePacked("")),
         "cid should not be empty");
        _;
    }

    modifier ifExistTokenId(uint _tokenId) {
        Article memory article = articles[nextTokenId];
        require(keccak256(abi.encodePacked(article.cid)) == keccak256(abi.encodePacked("")) ||
         article.author == address(0),
         "tokenId is already listed");
         _;
    }

    modifier ifNotExistTokenId(uint _tokenId) {
        Article memory article = articles[_tokenId];
        require(keccak256(abi.encodePacked(article.cid)) != keccak256(abi.encodePacked("")) &&
             article.author != address(0),
             "tokenId data is not found");
        _;
    }

    constructor() {}

    function listArticle (TokenType _tokenType, uint256 _price, string memory _cid) validCID(_cid) ifExistTokenId(nextTokenId) external returns (uint256) {
        articles[nextTokenId] = Article(_tokenType, _price, _cid, payable(msg.sender));
        uint currentTokenId = nextTokenId;
        nextTokenId++;
        return currentTokenId;
    }

    function delistArticle(uint256 _tokenId) external {
        require(msg.sender == articles[_tokenId].author, "caller is not the article's author");
        delete articles[_tokenId];
    }
    
    function getArticle(uint tokenId) external view ifNotExistTokenId(tokenId) returns (Article memory) {
        return articles[tokenId];
    }

}
