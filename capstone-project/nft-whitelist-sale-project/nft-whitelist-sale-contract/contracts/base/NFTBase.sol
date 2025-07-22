// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/INFTBase.sol";

abstract contract NFTBase is ERC721, Ownable, INFTBase {
    uint256 private _maxSupply;
    uint256 private _totalMinted;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialMaxSupply
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _maxSupply = initialMaxSupply;
    }
    
    function mint(address to, uint256 tokenId) public virtual override onlyOwner {
        require(_totalMinted < _maxSupply, "Max supply reached");
        _mint(to, tokenId);
        _totalMinted++;
    }
    
    function safeMint(address to, uint256 tokenId) public virtual override onlyOwner {
        require(_totalMinted < _maxSupply, "Max supply reached");
        _safeMint(to, tokenId);
        _totalMinted++;
    }
    
    // Hàm hỗ trợ để tăng tổng số lượng đã mint
    function _incrementTotalMinted() internal {
        _totalMinted++;
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalMinted;
    }
    
    function maxSupply() public view override returns (uint256) {
        return _maxSupply;
    }
    
    function setMaxSupply(uint256 newMaxSupply) public override onlyOwner {
        require(newMaxSupply >= _totalMinted, "New max supply must be >= current total minted");
        _maxSupply = newMaxSupply;
    }
} 