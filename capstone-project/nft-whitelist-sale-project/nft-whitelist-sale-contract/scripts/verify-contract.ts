// scripts/verifyNFT.ts
import { run } from "hardhat";

async function main() {
  const contractAddress = "0xb2e1832AD523F5ffC43BED3B9052E8d498F49BA9";
  
  // NFTWhitelistSale constructor parameters
  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const maxSupply = 100;
  const maxPerWallet = 10;
  const baseURI = "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";
  const price = "100000000000000";
  
  console.log("Verifying NFTWhitelistSale contract on Sepolia...");
  
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        nftName,
        nftSymbol,
        maxSupply,
        maxPerWallet,
        baseURI,
        price
      ],
      contract: "contracts/NFTWhitelistSale.sol:NFTWhitelistSale"
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });