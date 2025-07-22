import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  console.log("====================");
  console.log("Deploy NFTWhitelistSale Contract");
  console.log("====================");

  const nftName = "NFT Whitelist Private Sale";
  const nftSymbol = "NWPS";
  const mintPrice = hre.ethers.parseEther("0.0001"); 
  const maxSupply = 100;
  const maxPerWallet = 10;
  const baseURI =
    "https://harlequin-written-sheep-298.mypinata.cloud/ipfs/bafkreifxiuha2vxqm2w5bxmuqnzlmcznbfuifkb5lak7epj362vuy4gs5u/";

  // Tăng giá gas để ưu tiên giao dịch
  const gasPrice = hre.ethers.parseUnits("0.01", "gwei").toString();

  await deploy("NFTWhitelistSale", {
    from: deployer,
    log: true,
    args: [nftName, nftSymbol, maxSupply, maxPerWallet, baseURI, mintPrice],
    autoMine: true,
    skipIfAlreadyDeployed: false,
    gasPrice: gasPrice
  });
};

func.tags = ["deploy"];
export default func;
