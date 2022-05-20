const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Hyphen = await ethers.getContractFactory("HyphenProvider")
    const hyphen = await Hyphen.deploy(ethers.constants.AddressZero)
    await hyphen.deployed()

    await hyphen.transferNative(ethers.constants.AddressZero, ethers.constants.AddressZero, 43113, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('1') })

  });
});
