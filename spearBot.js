const hre = require("hardhat");
const yargs = require("yargs");
require("dotenv").config();
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json")
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json');


const options = yargs
 .option("ta", { alias: "tokenAddress", describe: "token contract address", type: "string", demandOption: true })
 .option("pk", { alias: "privateKey", describe: "wallet private key", type: "string", demandOption: true})
 .option("ea", { alias: "ethAmount", describe: "Amount of ETH to use in 1 trade", type: "string", demandOption: true})
 .option("r", { alias: "noOfRuns", describe: "No. of runs ", type: "number", demandOption: true})
 .argv;


const main = async () => {

console.log("Spear bot running....")
const provider = new hre.ethers.providers.WebSocketProvider(process.env.SEPOLIA_URL)

const SLIPPAGE = 0.05

const signer = new hre.ethers.Wallet(options.pk, provider)
const uniFactoryAddress = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003"
const uniRouterAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"
const WETHAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
const uniFactory = new hre.ethers.Contract(uniFactoryAddress, IUniswapV2Factory.abi, signer)
const uniRouter = new hre.ethers.Contract(uniRouterAddress, IUniswapV2Router02.abi, signer)
const spearToken = new hre.ethers.Contract(options.ta, IERC20.abi, signer)

    uniFactory.on('PairCreated', async() => {
        
        console.log("Liquidity detected....")
        
        for(i = 0; i < options.r; i++){

        
        const path = [WETHAddress, spearToken.address];
        const amountIn = hre.ethers.utils.parseEther(options.ea);
        const amounts = await uniRouter.getAmountsOut(amountIn, path);
        const minAmountOut = String(amounts[1] - (amounts[1] * SLIPPAGE))

        console.log("Buying tokens....")

        const tx = await uniRouter.swapETHForExactTokens(minAmountOut,
            path, signer.address, Date.now() + 1000 * 60 * 10, {value: amountIn})
    
        const receipt = await tx.wait()
    
        console.log('Transaction receipt');
        console.log(receipt);
        }

    })

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
