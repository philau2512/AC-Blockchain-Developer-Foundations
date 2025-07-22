// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./tokens/MintableNFT.sol";
import "./access/Whitelistable.sol";
import "./payment/PaymentManager.sol";

contract NFTWhitelistSale is MintableNFT, Whitelistable, PaymentManager {
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 maxPerWallet,
        string memory baseURI,
        uint256 price
    ) 
        MintableNFT(
            name, 
            symbol,
            maxSupply,
            maxPerWallet,
            baseURI
        )
        Whitelistable()
        PaymentManager(price)
    {}
    
    function mint(uint256 amount) external payable {
        // Kiểm tra whitelist
        require(isWhitelisted(msg.sender), "Not whitelisted");
        
        // Xử lý thanh toán - sử dụng processMintPayment
        processMintPayment(amount);
        
        require(amount > 0, "Amount must be greater than 0");
        require(mintedPerWallet(msg.sender) + amount <= maxPerWallet(), "Exceeds max per wallet");
        
        // Tăng số lượng đã mint cho ví này
        _updateMintedPerWallet(msg.sender, amount);
        
        // Mint NFTs trực tiếp thay vì gọi userMint
        for (uint256 i = 0; i < amount; i++) {
            uint256 currentTokenCount = totalSupply();
            uint256 newTokenId = currentTokenCount + 1;
            _mintNFT(msg.sender, newTokenId);
        }
    }
    
    // Hàm hỗ trợ để mint token mà không cần quyền owner
    function _mintNFT(address to, uint256 tokenId) private {
        require(totalSupply() < maxSupply(), "Max supply reached");
        _safeMint(to, tokenId);
        _increaseTotalSupply();
    }
    
    // Hàm hỗ trợ để cập nhật số lượng đã mint của một ví
    function _updateMintedPerWallet(address user, uint256 amount) private {
        _updateMintedCount(user, amount);
    }
    
    // Hàm hỗ trợ để tăng tổng số lượng đã mint
    function _increaseTotalSupply() private {
        _incrementTotalMinted();
    }
}