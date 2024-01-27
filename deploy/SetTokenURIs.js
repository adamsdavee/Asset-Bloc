const { ethers, getNamedAccounts, run, network } /*hre*/ = require("hardhat");
const { storeImages, storeTokenUriMetadata } = require("../UploadToPinata");
require("dotenv").config();

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  fractionalValue: "",
};

const imagesLocation = "./images";

module.exports = async function buyFractionOfAsset() {
  console.log("Hii");
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  // Get the IPFS metadata of the images
  let tokenUri;
  if (process.env.UPLOAD_TO_PINATA == "true") {
    console.log("Upload to Pinata is true!");
    tokenUri = await handleTokenUris();
    console.log("Pinata done");
  }

  console.log(tokenUri);

  const events = await deployments.get("EventCreation", deployer);
  console.log(events.address);
  const EventContract = await ethers.getContractAt(
    "EventCreation",
    events.address
  );

  const nftContract = await ethers.getContractAt(
    "FractionalNft",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    deployer
  );

  await EventContract.createSaleEvent(1, 1, "Land", 100);
  const allEvents = await EventContract.getSaleEvents();

  console.log(allEvents);

  const tx = await EventContract.buyAssetFraction(
    1,
    nftContract.target,
    10,
    tokenUri[0]
  );
  console.log("DOne");
  const txx = await nftContract.ownerOf(0);
  console.log(txx);
  console.log(deployer);
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
    tokenUriMetadata.description = `An aable ${tokenUriMetadata} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    // store JSON to pinata
    const metadataUploadResponse =
      await storeTokenUriMetadata(tokenUriMetadata);
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }

  return tokenUris;
}

module.exports.tags = ["mint"];
