// Script để tạo whitelist mặc định
const fs = require('fs');
const path = require('path');
const { createWhitelist } = require('./merkleTree');

// Đảm bảo thư mục tồn tại
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)){
  fs.mkdirSync(dataDir, { recursive: true });
}

// Danh sách địa chỉ whitelist mặc định (thay thế bằng địa chỉ thực)
const addresses = [
  '0x1234567890123456789012345678901234567890',
  '0xabcdef0123456789abcdef0123456789abcdef01',
  '0x9876543210987654321098765432109876543210',
  // Thêm địa chỉ khác...
];

// Tạo whitelist và lưu vào file
const outputPath = path.join(dataDir, 'whitelist.json');
const merkleRoot = createWhitelist(addresses, outputPath);

console.log('Whitelist đã được tạo với Merkle Root:', merkleRoot);
console.log('Bạn có thể sử dụng Merkle Root này khi deploy contract');
console.log(`Whitelist đã được lưu tại: ${outputPath}`);

// Hiển thị ví dụ về cách sử dụng
console.log('\nCách sử dụng trong hardhat deploy script:');
console.log(`const merkleRoot = "${merkleRoot}";`);
console.log('const nftContract = await ethers.deployContract("NFTWhitelistSale", [merkleRoot]);'); 