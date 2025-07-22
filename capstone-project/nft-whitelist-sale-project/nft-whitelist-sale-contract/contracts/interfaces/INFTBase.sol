// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFTBase {
    function mint(address to, uint256 tokenId) external;
    function safeMint(address to, uint256 tokenId) external;
    function totalSupply() external view returns (uint256);
    function maxSupply() external view returns (uint256);
    function setMaxSupply(uint256 _maxSupply) external;
} 