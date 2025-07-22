// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMerkleWhitelistable {
    function merkleRoot() external view returns (bytes32);
    function setMerkleRoot(bytes32 _merkleRoot) external;
    function isWhitelisted(address account, bytes32[] calldata proof) external view returns (bool);
} 