const { deployments, getNamedAccounts, network } = require("hardhat");
const { storeImages, storeTokenUriMetadata } = require("../UploadToPinata");
require("dotenv").config();

const imagesLocation = "./images";

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const chainId = network.config.chainId;

  // await deployments.fixture(["main"]);

  const eventContract = await deployments.get("EventCreation", deployer);

  console.log("Deploying Random NFT........");

  // await storeImages(imagesLocation);
  const args = [eventContract.address];
  const EventCreationContract = await deploy("FractionalNft", {
    from: deployer,
    args: args,
    log: true,
  });
  console.log(`Deployed contract at ${EventCreationContract.address}`);
};

module.exports.tags = ["all", "randomIpfs"];
