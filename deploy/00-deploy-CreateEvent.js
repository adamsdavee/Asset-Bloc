const { deployments, getNamedAccounts } = require("hardhat");

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  console.log("Create event contract........");

  const SaleEventsContract = await deploy("SaleEvents", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`Deployed contract at ${SaleEventsContract.address}`);
};

module.exports.tags = ["all", "randomIpfs", "main"];
