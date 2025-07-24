import { run } from "hardhat";

async function main() {
  const contractAddress = "0x42336E0a8b4D731df5725f7F8a54BE667A993fA9";

  // NFTSaleWhitelist constructor parameters
  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const maxSupply = 100;
  const maxPerWallet = 10;
  const baseURI =
    "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";
  const price = "100000000000000";

  console.log("Verifying NFTSaleWhitelist contract on Sepolia...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [nftName, nftSymbol, maxSupply, maxPerWallet, baseURI, price],
      contract: "contracts/NFTSaleWhitelist.sol:NFTSaleWhitelist",
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

  // npx hardhat run scripts/verify-contract.ts --network sepolia