const { task } = require("hardhat/config");

const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json');
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};

task("addLiquidity", "Add liquidity to the deployed token on UniswapV2")
.addParam("address", "token contract address")
.setAction(async(taskArgs, hre) => {

  const provider = new hre.ethers.providers.WebSocketProvider(process.env.SEPOLIA_URL)
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)
  console.log(signer)
  const SLIPPAGE = 10

  const uniswapRouterV2 = new hre.ethers.Contract("0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
  IUniswapV2Router02.abi, signer)

  const spearToken = new hre.ethers.Contract(taskArgs.address, IERC20.abi, signer)

  console.log("Preparing for adding liquidity...")

  const ethToAdd = hre.ethers.utils.parseEther("0.1")
  const tokenToAdd = hre.ethers.utils.parseEther("1000")
  const minToken = ethToAdd.sub(ethToAdd.div(SLIPPAGE))
  const minETH = tokenToAdd.sub(tokenToAdd.div(SLIPPAGE))
 
  console.log("Approving SPEAR...")

  await spearToken.connect(signer).approve(uniswapRouterV2.address, tokenToAdd)

  console.log("Creating pair...")

  await uniswapRouterV2.connect(signer).addLiquidityETH(
    taskArgs.address, tokenToAdd, minToken, minETH, signer.address,
    Math.floor(Date.now() / 1000) + 60 * 10, { value: ethToAdd }
  )

  console.log("Pool created successfully ")

});
