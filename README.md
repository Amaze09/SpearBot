## UniSniper Bot

This is a uniswap liquidity snipping bot. This bot can buy tokens as soon as liquidity is provided to the given token on uniswapV2. The bot has few params through which you can customize it.

tokenAddress - Contract address of the token to buy.
privateKey - Private key of the account from which you want to buy tokens.
ethAmount - Amount of ETH, the user wants to spend in a trade.(Balance of user is expected to be > ethAmount * noOfRuns)
noOfRuns - No. of times you want to trade.

Slippage is set to 5% (default) but it can be changed.


## Installation 

Clone this bot repo and from the working directory hit 
```npm i```

This command installs all the dependencies required to run the bot.
We also need to create a .env file and add SEPOLIA_URL (sepolia websocket URL) and PRIVATE_KEY (account private key for deploying the token contract)

## Usage 

To check the usage of the bot we need to do 3 steps 

1) Deploy a token 

In the contracts folder you can find a dummy token which mints some token to the deployer.

Run 
```npx hardhat run scripts/deploy.js```

2) Start the bot and wait for liquidity to be added

To start the bot we need to provide the params listed above and all the params are required.

Run
```node spearbot.js --ta <tokenAddress> --pk <privateKey> --ea <ethAmount> --r <noOfRuns>```

3) Add liquidity to the token 

In the hardhat config you can find a task of adding liquidity to the give token address

Run
```npx hardhat addLiquidity --address <token address>```


NOTE - These steps are required just for demo, for actually using the bot only the installation and 3rd step is required.