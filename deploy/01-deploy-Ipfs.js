const { deployments, getNamedAccounts, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/UploadToPinata");
require("dotenv").config();

const imagesLocation = "./images/randomNft";

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  value: "",
};

const FUND_AMOUNT = ethers.parseEther("3");

module.exports = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const chainId = network.config.chainId;
  const checkAddress = networkConfig[chainId].name;
  console.log(checkAddress);

  // Get the IPFS hashes of the images
  let tokenUris;
  if (process.env.UPLOAD_TO_PINATA == "true") {
    console.log("Upload to Pinata is true!");
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

  if (developmentChains.includes(network.name)) {
    const vrfAddress = await deployments.get("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfAddress.address;
    vrfCoordinatorV2Mock = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      vrfCoordinatorV2Address
    );
    // console.log(vrfCoordinatorV2Mock);
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait();
    // const subscription = txReceipt.logs[0].args.subId;
    // console.log(subscription);
    subscriptionId = txReceipt.logs[0].args.subId;
    console.log(subscriptionId);
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  console.log("Deploying Random NFT........");

  // await storeImages(imagesLocation);
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];
  const RandomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
  });
  console.log(`Deployed contract at ${RandomIpfsNft.address}`);

  if (chainId != 31337) {
    await verify(RandomIpfsNft.address, args);
    log("verified........");
  }
};

async function handleTokenUris() {
  tokenUris = [];
  // store the image in IPFS
  // store the metadat in IPFS

  const { responses: imageUploadResponses, files } =
    await storeImages(imagesLocation);
  for (imageUploadResponseIndex in imageUploadResponses) {
    // create metadata
    // upload the metadata
    let tokenUriMetadata = { ...metadataTemplate };
    //pug.png
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    // store JSON to pinata
    const metadataUploadResponse =
      await storeTokenUriMetadata(tokenUriMetadata);
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }

  console.log("Token URIs Uploaded! They are:");
  console.log(tokenUris);

  return tokenUris;
}

module.exports.tags = ["all", "randomIpfs", "main"];
