import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy();
  await nft.waitForDeployment();
  console.log("Deployed:", await nft.getAddress());
  await nft.mint(deployer.address);
  console.log("Minted NFT to:", deployer.address);
}
main();