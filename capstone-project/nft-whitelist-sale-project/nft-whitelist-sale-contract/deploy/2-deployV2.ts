import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  // Config cho NFT
  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const maxSupply = 100;
  const baseURI =
    "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";

  // Config cho Sale
  const mintPrice = hre.ethers.parseEther("0.0001");
  const maxPerWallet = 10;

  // Whitelist addresses
  const whitelistAddresses = [
    "0x71520c125C027694Daac3795a291E1041EcA36f0",
    "0x4c16cc2a00704741550F61789033e44ACd85cee7",
  ];

  // Tạo merkle tree
  const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");

  console.log("Merkle Root:", merkleRoot);

  const gasPrice = hre.ethers.parseUnits("1", "gwei").toString();

  // 1. Deploy NFTBase
  console.log("====================");
  console.log("Deploy NFTBase Contract");
  console.log("====================");

  const nftBase = await deploy("NFTBase", {
    from: deployer,
    args: [nftName, nftSymbol, maxSupply, baseURI],
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
    gasPrice: gasPrice,
  });

  // 2. Deploy NFTSaleManager
  console.log("====================");
  console.log("Deploy NFTSaleManager Contract");
  console.log("====================");

  const saleManager = await deploy("NFTSaleManager", {
    from: deployer,
    args: [nftBase.address, maxPerWallet, mintPrice, merkleRoot],
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
    gasPrice: gasPrice,
  });

  // 3. Set SaleManager trong NFTBase
  const nftBaseContract = await hre.ethers.getContractAt("NFTBase", nftBase.address);
  if ((await nftBaseContract.saleManager()) !== saleManager.address) {
    console.log("Setting SaleManager in NFTBase...");
    await nftBaseContract.setSaleManager(saleManager.address);
    console.log("SaleManager set successfully!");
  }

  // Log thông tin quan trọng
  console.log("====================");
  console.log("Deployment Summary:");
  console.log("NFTBase:", nftBase.address);
  console.log("NFTSaleManager:", saleManager.address);
  console.log("Whitelist Addresses:", whitelistAddresses);
  console.log("Merkle Root:", merkleRoot);
  console.log("====================");
};

func.tags = ["deployV2"];
export default func;
