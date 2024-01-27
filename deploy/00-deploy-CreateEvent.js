const { deployments, getNamedAccounts } = require("hardhat");

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  console.log("Create event contract........");

  const EventCreationContract = await deploy("EventCreation", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log(`Deployed contract at ${EventCreationContract.address}`);
};

module.exports.tags = ["all", "randomIpfs", "main"];
