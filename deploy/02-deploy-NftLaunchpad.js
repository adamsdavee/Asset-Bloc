const {ethers,network } = require("hardhat");


async function LaunchNft() {

  const chainId = network.config.chainId;
  const NftLaunchpad = await ethers.deployContract("FractionalNft", ["0x5F77684fd47CE20606212cdd9548cE45FF57c776"])

  await NftLaunchpad.waitForDeployment();

  console.log(
    ` deployed to ${NftLaunchpad.target}`
  );
}

LaunchNft().then(() => process.exit(0))
.catch((error) => {
  console.error(error)
  process.exit(1)
});


module.exports =  { LaunchNft }