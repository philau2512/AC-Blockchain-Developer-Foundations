import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.public.blastapi.io"
  );
  const yourAddress = "0x71520c125C027694Daac3795a291E1041EcA36f0";
  const contractAddress = "0xb8E53C0Da23C4eEE14f7ad57ECe00Bb6Fd70Bf91"; // tx : 0xeef79625f1250e24893c917912f3fc2a1104d7504960d02f3f6fb91e5ecf9f9d

  const abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, provider);

  const balance = await contract.balanceOf(yourAddress);
  const decimals = await contract.decimals();
  const symbol = await contract.symbol();

  // Format số dư
  console.log("Số dư token của bạn là:", ethers.formatUnits(balance, decimals), symbol);
}

main().catch(console.error);
