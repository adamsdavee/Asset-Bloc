const { ethers, getNamedAccounts, run, network } /*hre*/ = require("hardhat");

// 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
const AMOUNT = ethers.parseEther("0.02");

async function getWeth() {
  // const { deployer } = await getNamedAccounts();
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  console.log("Hey");

  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );

  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT };
