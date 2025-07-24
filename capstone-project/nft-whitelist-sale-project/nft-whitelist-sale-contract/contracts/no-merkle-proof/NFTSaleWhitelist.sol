// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTSaleWhitelist is ERC721, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public totalMinted;
    uint256 public maxPerWallet;
    string public baseURI;
    uint256 public price;
    
    mapping(address => bool) private whitelist;
    mapping(address => uint256) private mintedPerWallet;
    mapping(uint256 => string) private _tokenURIs;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _maxPerWallet,
        string memory _baseURI,
        uint256 _price
    ) ERC721(name, symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
        baseURI = _baseURI;
        price = _price;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    /** ============================= GETTERS & SETTERS ============================= */

    function setMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= totalMinted, "New max supply must be >= total minted");
        maxSupply = newMaxSupply;
    }

    function setMaxPerWallet(uint256 newMaxPerWallet) public onlyOwner {
        maxPerWallet = newMaxPerWallet;
    }
    
    function getMintedPerWallet(address user) public view returns (uint256) {
        return mintedPerWallet[user];
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
    
    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /** ============================= FUNCTIONS ============================= */

    function addToWhitelist(address user) public onlyOwner {
        require(!whitelist[user], "Address already in whitelist");
        whitelist[user] = true;
    }

    function revokeWhitelist(address user) public onlyOwner {
        require(whitelist[user], "Address not in whitelist");
        whitelist[user] = false;
    }
    
    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }
    
    function setTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "URI set for nonexistent token");
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        string memory tokenURIValue = _tokenURIs[tokenId];
        if (bytes(tokenURIValue).length > 0) {
            return tokenURIValue;
        }
        
        if (bytes(baseURI).length > 0) {
            return string(abi.encodePacked(baseURI, tokenId.toString()));
        }
        
        return "";
    }

    /** ============================= MINT ============================= */

    function mint(uint256 amount) external payable onlyWhitelisted {
        require(amount > 0, "Amount must be greater than 0");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Exceeds the maximum number of tokens per wallet");
        
        uint256 requiredPayment = price * amount;
        require(msg.value >= requiredPayment, "Payment is not enough");
        
        mintedPerWallet[msg.sender] += amount;
        
        for (uint256 i = 0; i < amount; i++) {
            require(totalMinted < maxSupply, "Exceeds the maximum number of tokens");
            uint256 newTokenId = totalMinted + 1;
            _safeMint(msg.sender, newTokenId);
            totalMinted = newTokenId;
        }
    }
    
    // Hàm mint batch dành cho owner
    function mintBatch(address to, uint256 amount) public onlyOwner {
        require(mintedPerWallet[to] + amount <= maxPerWallet, "Exceeds the maximum number of tokens per wallet");
        
        mintedPerWallet[to] += amount;
        
        for (uint256 i = 0; i < amount; i++) {
            require(totalMinted < maxSupply, "Exceeds the maximum number of tokens");
            uint256 newTokenId = totalMinted + 1;
            _safeMint(to, newTokenId);
            totalMinted++;
        }
    }
}