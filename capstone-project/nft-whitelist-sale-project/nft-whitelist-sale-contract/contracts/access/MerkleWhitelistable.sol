// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "../interfaces/IMerkleWhitelistable.sol";

abstract contract MerkleWhitelistable is Ownable, IMerkleWhitelistable {
    bytes32 public override merkleRoot;
    
    event MerkleRootChanged(bytes32 merkleRoot);
    
    constructor(bytes32 initialMerkleRoot) {
        merkleRoot = initialMerkleRoot;
    }
    
    function setMerkleRoot(bytes32 _merkleRoot) external override onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }
    
    function isWhitelisted(address account, bytes32[] calldata proof) public view override returns (bool) {
        return _verify(_leaf(account), proof);
    }
    
    function _leaf(address account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account));
    }
    
    function _verify(bytes32 leaf, bytes32[] calldata proof) internal view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
    
    modifier onlyWhitelisted(bytes32[] calldata proof) {
        require(isWhitelisted(msg.sender, proof), "Not whitelisted");
        _;
    }
} 