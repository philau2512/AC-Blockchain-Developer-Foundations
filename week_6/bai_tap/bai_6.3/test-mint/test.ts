import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");
  
  // Thêm private key để ký giao dịch (thay YOUR_PRIVATE_KEY bằng private key thật)
  const privateKey = "YOUR_PRIVATE_KEY";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  const abi = [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)",
    "function mint(address to) returns ()",
    "function tokenURI(uint256 tokenId) view returns (string)"
  ];
  
  const contractAddress = "0x67fDd9525BA1fF7edE62ec900D7d5676C13CA2C5"; 
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Kiểm tra owner của token
  try {
    const owner0 = await contract.ownerOf(0);
    console.log("Owner của token 0:", owner0);
  } catch (error) {
    console.log("Token 0 không tồn tại");
    
    try {
      const owner1 = await contract.ownerOf(1);
      console.log("Owner của token 1:", owner1);
    } catch (error) {
      console.log("Token 1 cũng không tồn tại");
    }
  }
  
  // Mint NFT mới cho địa chỉ của bạn
  console.log("Đang mint NFT mới...");
  const tx = await contract.mint(wallet.address);
  await tx.wait();
  console.log("Đã mint NFT cho:", wallet.address);
  
  // Kiểm tra số lượng NFT của bạn
  const balance = await contract.balanceOf(wallet.address);
  console.log("Số NFT của bạn:", balance.toString());
}

main().catch(console.error);