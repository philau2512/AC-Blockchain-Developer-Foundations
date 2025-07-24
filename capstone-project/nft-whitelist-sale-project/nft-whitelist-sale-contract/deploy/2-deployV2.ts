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

  console.log("====================");
  console.log("Deploy NFTSaleWhitelist V2 Contract");
  console.log("====================");

  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const mintPrice = hre.ethers.parseEther("0.0001");
  const maxSupply = 100;
  const maxPerWallet = 10;
  const baseURI =
    "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";

  const whitelistAddresses = [
    "0x71520c125C027694Daac3795a291E1041EcA36f0",
    "0x4c16cc2a00704741550F61789033e44ACd85cee7"
  ];

  // Tạo merkle tree
  const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getRoot();

  console.log("Merkle Root:", merkleRoot.toString("hex"));

  const gasPrice = hre.ethers.parseUnits("1", "gwei").toString();

  await deploy("NFTSaleWhitelistV2", {
    from: deployer,
    log: true,
    args: [
      nftName,
      nftSymbol,
      maxSupply,
      maxPerWallet,
      baseURI,
      mintPrice,
      "0x" + merkleRoot.toString("hex"),
    ],
    autoMine: true,
    skipIfAlreadyDeployed: false,
    gasPrice: gasPrice,
  });

  // Log thông tin để lưu lại
  console.log("Whitelist Addresses:", whitelistAddresses);
  console.log("Merkle Root:", "0x" + merkleRoot.toString("hex"));
};

func.tags = ["deployV2"];
export default func;
