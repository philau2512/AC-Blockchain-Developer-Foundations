import { ethers } from "hardhat";
import { formatUnits } from "ethers";
import { MyToken } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Kiểm tra với địa chỉ: ", deployer.address);

  const myToken: MyToken = await ethers.getContract("MyToken");
  
  const balance = await myToken.balanceOf(deployer.address);
  console.log("Số dư token của deployer:", formatUnits(balance, 18));
  
  const totalSupply = await myToken.totalSupply();
  console.log("Tổng cung token:", formatUnits(totalSupply, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});