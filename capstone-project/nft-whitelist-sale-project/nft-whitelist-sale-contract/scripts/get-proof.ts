import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "hardhat";

const whitelistAddresses = [
  "0x71520c125C027694Daac3795a291E1041EcA36f0",
  "0x4c16cc2a00704741550F61789033e44ACd85cee7"
];

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const root = merkleTree.getHexRoot();
console.log("Merkle Root:", root);

// Lấy proof cho 1 địa chỉ
const address = '0x4c16cc2a00704741550F61789033e44ACd85cee7';
const leaf = keccak256(address);
const proof = merkleTree.getHexProof(leaf);
console.log("Proof:", proof);

// [0x9b85e9971aa1a25c32905461445be1544693da37bc396eb851e2cf4a5ff9309f]
// [0x015cdfa0f1bd82760d13af7df16d4718ad1d1a8d7e227faa3a0225d26bdb155c]
