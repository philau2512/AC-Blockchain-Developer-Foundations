import { run } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main() {
  const contractAddress = "0x275a99570CbEE46C60d025Ed23F7ec5DAd6349d0";

  // NFTSaleWhitelistV2 constructor parameters
  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const maxSupply = 100;
  const maxPerWallet = 10;
  const baseURI =
    "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";
  const price = "100000000000000";

  // Whitelist addresses 
  const whitelistAddresses = [
    "0x71520c125C027694Daac3795a291E1041EcA36f0",
    "0x4c16cc2a00704741550F61789033e44ACd85cee7"
  ];

  // Tạo lại merkle root giống như lúc deploy
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");

  console.log("Verifying NFTSaleWhitelistV2 contract on Sepolia...");
  console.log("Merkle Root:", merkleRoot);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        nftName, 
        nftSymbol, 
        maxSupply, 
        maxPerWallet, 
        baseURI, 
        price,
        merkleRoot
      ],
      contract: "contracts/NFTSaleWhitelistV2.sol:NFTSaleWhitelistV2"
    });
    console.log("Contract verified successfully!");

    // Log thêm thông tin để double check
    console.log("\nVerification Details:");
    console.log("Contract Address:", contractAddress);
    console.log("Whitelist Addresses:", whitelistAddresses);
    console.log("Merkle Root:", merkleRoot);
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

// npx hardhat run scripts/verify-contract-v2.ts --network sepolia