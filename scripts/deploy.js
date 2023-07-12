// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  
  const provider = new hre.ethers.providers.WebSocketProvider(process.env.SEPOLIA_URL)
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const Spear = await hre.ethers.getContractFactory("SpearToken", signer);
  const spear = await Spear.deploy();

  await spear.deployed();

  console.log(
    `Spear token deployed to ${spear.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
