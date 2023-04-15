// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

enum TokenTypes { Matic, Ft }

interface IMarket {
    /***********
     * STRUCTS *
     ***********/
    
    struct Article {
        TokenTypes method;
        uint256 price;
        string cid;
        address payable author;
    }

    /**********
     * EVENTS *
     **********/ 
    
    event Issue( uint256 tokenId );
    event Star( address indexed from, address indexed to, uint256 amount );

    /*************
     * FUNCTIONS *
     *************/

    function listArticle (TokenTypes _method, uint256 _price, string memory _cid, uint256 _tokenId) external;

    function delistArticle (uint _tokenId) external;

    function purchaseArticle (uint256 tokenId) payable external;

    function sendStar(uint tokenId) external;

    function getArticle(uint tokenId) external view returns (Article memory);
}
