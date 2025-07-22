// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../base/NFTBase.sol";

abstract contract NFTMetadata is NFTBase {
    // Base URI cho metadata của collection
    string private _baseTokenURI;
    
    // Mapping từ tokenId tới URI tùy chỉnh
    mapping(uint256 => string) private _tokenURIs;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialMaxSupply,
        string memory baseTokenURI
    ) NFTBase(name, symbol, initialMaxSupply) {
        _baseTokenURI = baseTokenURI;
    }
    
    // Đặt base URI cho toàn bộ collection
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    // Đặt URI tùy chỉnh cho một token cụ thể
    function setTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
        // Kiểm tra xem token có tồn tại không
        require(_ownerOf(tokenId) != address(0), "URI set for nonexistent token");
        _tokenURIs[tokenId] = uri;
    }
    
    // Lấy URI của token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Kiểm tra xem token có tồn tại không
        require(_ownerOf(tokenId) != address(0), "URI query for nonexistent token");
        
        // Nếu token có URI tùy chỉnh, trả về URI đó
        string memory tokenURIValue = _tokenURIs[tokenId];
        if (bytes(tokenURIValue).length > 0) {
            return tokenURIValue;
        }
        
        // Ngược lại, trả về baseURI + tokenId
        if (bytes(_baseTokenURI).length > 0) {
            return string(abi.encodePacked(_baseTokenURI, _toString(tokenId)));
        }
        
        return "";
    }
    
    // Hàm hỗ trợ chuyển uint256 sang string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
} 