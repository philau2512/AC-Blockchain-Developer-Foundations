// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTMetadata.sol";

abstract contract MintableNFT is NFTMetadata {
    uint256 private _maxPerWallet;
    mapping(address => uint256) private _mintedPerWallet;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialMaxSupply,
        uint256 initialMaxPerWallet,
        string memory baseTokenURI
    ) NFTMetadata(name, symbol, initialMaxSupply, baseTokenURI) {
        _maxPerWallet = initialMaxPerWallet;
    }
    
    function setMaxPerWallet(uint256 newMaxPerWallet) public onlyOwner {
        _maxPerWallet = newMaxPerWallet;
    }
    
    function maxPerWallet() public view returns (uint256) {
        return _maxPerWallet;
    }
    
    function mintedPerWallet(address user) public view returns (uint256) {
        return _mintedPerWallet[user];
    }
    
    // Hàm hỗ trợ để cập nhật số lượng đã mint của một ví
    function _updateMintedCount(address user, uint256 amount) internal {
        _mintedPerWallet[user] += amount;
    }
    
    function mintBatch(address to, uint256 amount) public virtual onlyOwner {
        require(_mintedPerWallet[to] + amount <= _maxPerWallet, "Exceeds max per wallet");
        
        _mintedPerWallet[to] += amount;
        uint256 currentSupply = totalSupply();
        
        for (uint256 i = 0; i < amount; i++) {
            safeMint(to, currentSupply + i + 1);
        }
    }
    
    function userMint(uint256 amount) public virtual {
        require(_mintedPerWallet[msg.sender] + amount <= _maxPerWallet, "Exceeds max per wallet");
        
        _mintedPerWallet[msg.sender] += amount;
        
        for (uint256 i = 0; i < amount; i++) {
            uint256 currentTokenCount = totalSupply(); // Lấy tổng số token hiện tại
            uint256 newTokenId = currentTokenCount + 1; // TokenId mới
            safeMint(msg.sender, newTokenId);
        }
    }
} 