// Script để quản lý Merkle Tree cho whitelist
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');

/**
 * Tạo Merkle Tree từ danh sách địa chỉ
 * @param {string[]} addresses - Danh sách địa chỉ được whitelist
 * @returns {object} Đối tượng chứa merkleTree và merkleRoot
 */
function generateMerkleTree(addresses) {
  // Tạo leaf nodes
  const leafNodes = addresses.map(addr => 
    keccak256(addr.toLowerCase())
  );
  
  // Tạo Merkle Tree
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
  // Lấy merkle root
  const merkleRoot = '0x' + merkleTree.getRoot().toString('hex');
  
  return { merkleTree, merkleRoot };
}

/**
 * Tạo proof cho một địa chỉ
 * @param {object} merkleTree - Đối tượng merkle tree
 * @param {string} address - Địa chỉ cần tạo proof
 * @returns {string[]} Merkle proof cho địa chỉ
 */
function getProofForAddress(merkleTree, address) {
  const leaf = keccak256(address.toLowerCase());
  const proof = merkleTree.getHexProof(leaf);
  return proof;
}

/**
 * Kiểm tra một địa chỉ có trong whitelist không
 * @param {string} address - Địa chỉ cần kiểm tra
 * @param {string[]} proof - Merkle proof của địa chỉ
 * @param {string} merkleRoot - Merkle root
 * @returns {boolean} true nếu địa chỉ hợp lệ
 */
function verifyAddress(address, proof, merkleRoot) {
  const leaf = keccak256(address.toLowerCase());
  return MerkleTree.verify(proof, merkleRoot, leaf, keccak256, { sortPairs: true });
}

/**
 * Lưu whitelist và merkle root vào file
 * @param {string[]} addresses - Danh sách địa chỉ whitelist
 * @param {string} merkleRoot - Merkle root
 * @param {string} filePath - Đường dẫn file lưu trữ
 */
function saveWhitelist(addresses, merkleRoot, filePath) {
  const data = {
    addresses,
    merkleRoot,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Whitelist saved to ${filePath}`);
}

/**
 * Tạo và lưu file whitelist mới
 * @param {string[]} addresses - Danh sách địa chỉ whitelist
 * @param {string} outputPath - Đường dẫn file lưu trữ
 * @returns {string} Merkle root
 */
function createWhitelist(addresses, outputPath = './data/whitelist.json') {
  const { merkleTree, merkleRoot } = generateMerkleTree(addresses);
  saveWhitelist(addresses, merkleRoot, outputPath);
  return merkleRoot;
}

// Nếu chạy trực tiếp file này
if (require.main === module) {
  // Ví dụ sử dụng
  const addresses = [
    '0x1234567890123456789012345678901234567890',
    '0xabcdef0123456789abcdef0123456789abcdef01',
    '0x9876543210987654321098765432109876543210'
  ];
  
  const merkleRoot = createWhitelist(addresses);
  console.log('Merkle Root:', merkleRoot);
  
  // Tạo và kiểm tra proof
  const { merkleTree } = generateMerkleTree(addresses);
  const proof = getProofForAddress(merkleTree, addresses[0]);
  console.log('Proof for address', addresses[0], ':', proof);
  
  const isValid = verifyAddress(addresses[0], proof, merkleRoot);
  console.log('Address verification:', isValid ? 'Valid' : 'Invalid');
}

module.exports = {
  generateMerkleTree,
  getProofForAddress,
  verifyAddress,
  createWhitelist,
  saveWhitelist
}; 