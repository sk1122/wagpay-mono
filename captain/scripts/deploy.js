// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Hyphen = await hre.ethers.getContractFactory("UniV3Provider");
  const hyphen = await Hyphen.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");

  await hyphen.deployed();

  // let trans = await hyphen.transferNative(
  //   ethers.utils.parseEther('0.1'),
  //   "0x3f6C3Bc1679731825d457541bD27C1d713698306",
  //   137,
  //   "0x00",
  //   {value : ethers.utils.parseEther('0.1')}
  // );

  console.log(hyphen.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
