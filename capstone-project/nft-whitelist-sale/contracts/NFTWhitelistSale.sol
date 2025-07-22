// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTWhitelistSale is ERC721, Ownable(msg.sender) {
    uint256 public price = 0.000001 ether;
    uint256 public maxSupply = 50;
    uint256 public maxPerWallet = 2;
    uint256 public totalMinted = 0;

    constructor() ERC721("NFTWhitelistSale", "NFTWS") {
    }

    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedPerWallet;

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
    }

    function isWhitelisted(address _address) external view returns (bool) {
        return whitelist[_address];
    }

   function mint(uint256 amount) external payable onlyWhitelisted {
        require(totalMinted + amount <= maxSupply, "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Exceeds max per wallet");
        require(msg.value >= price * amount, "Insufficient payment");

        mintedPerWallet[msg.sender] += amount;

        for (uint256 i = 0; i < amount; i++) {
            totalMinted++;
            _safeMint(msg.sender, totalMinted);
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}