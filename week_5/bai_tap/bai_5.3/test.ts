import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.public.blastapi.io"
  );
  const abi = [
    "function getCount() public view returns (uint)",
    "function increment() public",
  ];

  const contractAddress = "0x2368a0eB52F4c9b2F8F53f52Ad3C79B9Fc98b401";

  const contract = new ethers.Contract(contractAddress, abi, provider);

  const count = await contract.getCount();
  console.log("Current count is:", count.toString());
}

main().catch(console.error);
