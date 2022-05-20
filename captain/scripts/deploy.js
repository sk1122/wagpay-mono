// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Hyphen = await hre.ethers.getContractFactory("HyphenProvider");
  const hyphen = await Hyphen.deploy("0x2A5c2568b10A0E826BfA892Cf21BA7218310180b");

  await hyphen.deployed();

  console.log("HyphenProvider deployed to:", hyphen.address);

    const [addr1, addr2] = await ethers.getSigners();
    
  await hyphen.transferNative(addr1.address, addr1.address,1, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')})
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });