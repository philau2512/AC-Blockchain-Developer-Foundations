import { run } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main() {
  // Địa chỉ của 2 contract sau khi deploy
  const nftBaseAddress = "0x0bF3D310A810E3376402a996831d02D3062F33d5";
  const saleManagerAddress = "0x99722B257A01eed110c6A3351BB78fACd45d2E80";

  // NFTBase constructor parameters
  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const maxSupply = 100;
  const baseURI = "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";

  // SaleManager constructor parameters
  const maxPerWallet = 10;
  const price = "100000000000000"; // 0.0001 ETH

  // Whitelist addresses 
  const whitelistAddresses = [
    "0x71520c125C027694Daac3795a291E1041EcA36f0",
    "0x4c16cc2a00704741550F61789033e44ACd85cee7"
  ];

  // Tạo lại merkle root
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");

  console.log("====================");
  console.log("Verifying NFTBase contract...");
  console.log("====================");

  try {
    await run("verify:verify", {
      address: nftBaseAddress,
      constructorArguments: [
        nftName,
        nftSymbol,
        maxSupply,
        baseURI
      ],
      contract: "contracts/use-merkle-proof/NFTBase.sol:NFTBase"
    });
    console.log("NFTBase verified successfully!");
  } catch (error) {
    console.error("NFTBase verification failed:", error);
  }

  console.log("====================");
  console.log("Verifying NFTSaleManager contract...");
  console.log("====================");

  try {
    await run("verify:verify", {
      address: saleManagerAddress,
      constructorArguments: [
        nftBaseAddress,
        maxPerWallet,
        price,
        merkleRoot
      ],
      contract: "contracts/use-merkle-proof/NFTSaleManager.sol:NFTSaleManager"
    });
    console.log("NFTSaleManager verified successfully!");
  } catch (error) {
    console.error("NFTSaleManager verification failed:", error);
  }

  // Log thông tin verify
  console.log("\nVerification Summary:");
  console.log("NFTBase Address:", nftBaseAddress);
  console.log("NFTSaleManager Address:", saleManagerAddress);
  console.log("Whitelist Addresses:", whitelistAddresses);
  console.log("Merkle Root:", merkleRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/verify-contract-v2.ts --network sepolia