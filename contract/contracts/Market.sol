// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/INFT.sol";
import "./interface/ITreasury.sol";
import "./interface/IMarket.sol";

contract Market is Ownable, IMarket {
    using Counters for Counters.Counter;

    /************
     * CONSTANTS
     ************/

    IERC20    public ft;
    INFT      public nft;
    ITreasury public treasury;

    uint8 commissionPercentage = 5; // 5%
    Counters.Counter private _nextTokenId;

    mapping (address => uint256) public userToStar;
    mapping (uint256 => uint256) public tokenIdToStar;
    mapping (address => mapping( uint256 => bool )) public consumerToSentStars;

    mapping (uint256 => Article) articles;

    /************
     * MODIFIER *
     ************/
    
    modifier nonEmptyCID(string memory _cid) {
        require(bytes(_cid).length > 0, "cid should not be empty");
        _;
    }

    modifier checkDup(string memory _cid) {
        bool valid = true;
        
        for (uint256 i = 1; i < _nextTokenId.current(); i++) {
            if (keccak256(bytes(articles[i].cid)) == keccak256(bytes(_cid))) {
                valid = false;
            }
        }

        require(valid, "the CID has already listerd");
        _;
    }

    /**************
     * CONSTRUCTOR
     **************/

    constructor(IERC20 _ft, INFT _nft, ITreasury _treasury) {
        ft = _ft;
        nft = _nft;
        treasury = _treasury;
        _nextTokenId.increment();
    }

    receive() external payable {}

    fallback() external payable {}

    /******************
     * CORE FUNCTIONS *
     ******************/

    function issueTokenId() external {
        emit Issue(_nextTokenId.current());
        _nextTokenId.increment();
    }

    /**
     * @dev add article to article list
     */
    function listArticle (TokenTypes _method, uint256 _price, string memory _cid, uint256 _tokenId) external nonEmptyCID(_cid) checkDup(_cid) {
        require(!_tokenIdExists(_tokenId), "tokenId cannot duplicate");
        require(_nextTokenId.current() > _tokenId, "invalid token id");
        articles[_tokenId] = Article(_method, _price, _cid, payable(msg.sender));
    }

    /**
     * @dev remove article to article list
     */
    function delistArticle (uint _tokenId) external {
        require(_tokenIdExists(_tokenId), "the tokenId does not exist");
        require(msg.sender == articles[_tokenId].author, "caller is not the author of this article");
        delete articles[_tokenId];
    }

    /**
     * @dev purchase article
     */
    function purchaseArticle (uint256 tokenId) payable external {
        require(_tokenIdExists(tokenId), "the tokenId does not exist");
        require(articles[tokenId].author != msg.sender, "cannot buy your article yourselves");

        Article memory article = articles[tokenId];
        uint256 priceForCommission =  article.price / 100 * commissionPercentage;
        uint256 priceForAuthor = article.price / 100 * ( 100 - commissionPercentage );
        address payable treasuryAddress = payable(address(treasury));
        if (article.method == TokenTypes.Matic) {
            require(msg.value == article.price, "insufficient value for the price of the article");
            treasuryAddress.transfer(priceForCommission);
            article.author.transfer(priceForAuthor);
            treasury.receiveSales(TokenTypes.Matic, priceForCommission);
        } else if (article.method == TokenTypes.Ft) {
            require(msg.value == 0, "value should be 0");
            require(ft.balanceOf(msg.sender) >= article.price, "insufficient value for the article's price");
            ft.transferFrom(msg.sender, treasuryAddress, priceForCommission);
            ft.transferFrom(msg.sender, article.author, priceForAuthor);
            treasury.receiveSales(TokenTypes.Ft, priceForCommission);
        }
        
        // mint
        nft.mintAndTransfer(tokenId, article.cid, msg.sender);
    }

    /**
     * @dev evaluate the sender's having article & send rewards for its action
     */
    function sendStar(uint tokenId) external {
        require(nft.balanceOf(msg.sender, tokenId) > 0, "caller dose not have the article");
        require(!consumerToSentStars[msg.sender][tokenId], "you've already sent star to this article");
        Article memory _article = articles[tokenId];
        consumerToSentStars[msg.sender][tokenId] = true;
        
        uint256 star = _article.price;
        userToStar[_article.author] += star;
        tokenIdToStar[tokenId] += star;

        treasury.sendReward(_article.author, msg.sender, star / 100);

        emit Star(msg.sender, _article.author, star);
    }

    /******************
     * GET FUNCTIONS *
     ******************/

    function getArticle(uint tokenId) external view returns (Article memory) {
        require(_tokenIdExists(tokenId), "the tokenId does not exist");
        return articles[tokenId];
    }

    function _tokenIdExists(uint256 tokenId) private view returns(bool) {
        Article memory article = articles[tokenId];
        return (
            bytes(article.cid).length > 0 && article.author != address(0)
        );
    }
}
