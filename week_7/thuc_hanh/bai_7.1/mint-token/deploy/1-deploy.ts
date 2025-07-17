import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  console.log("====================");
  console.log("Deploy MyMintableToken Contract");
  console.log("====================");

  const token = await deploy("MyMintableToken", {
    contract: "MyMintableToken",
    args: [],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`MyMintableToken deployed at: ${token.address}`);

  // Mint 1000 tokens to deployer
  const tokenContract = await ethers.getContractAt("MyMintableToken", token.address);
  const mintAmount = ethers.parseEther("1000"); // 1000 tokens with 18 decimals

  // Check if we need to mint (only if not already minted)
  const deployerBalance = await tokenContract.balanceOf(deployer);
  if (deployerBalance === BigInt(0)) {
    console.log("Minting 1000 tokens to deployer...");
    const mintTx = await tokenContract.mint(deployer, mintAmount);
    await mintTx.wait(1);
    console.log(`Minted 1000 tokens to ${deployer}`);
  } else {
    console.log("Tokens already minted to deployer");
  }

  // Print deployer balance
  const finalBalance = await tokenContract.balanceOf(deployer);
  console.log(`Deployer balance: ${ethers.formatEther(finalBalance)} MMT`);

};

func.tags = ["deploy"];
export default func;