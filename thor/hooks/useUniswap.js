import { ethers } from "ethers"

const abi = [
	{
		"inputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "_swapRouter",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "poolFee",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "",
				"type": "uint24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenIn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"name": "swapExactInputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenIn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountInMaximum",
				"type": "uint256"
			}
		],
		"name": "swapExactOutputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapRouter",
		"outputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const ERC20abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]

const factoryAbi = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        
const WETHabi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]


const useUniswap = () => {

	const getAmountOut = async (fromToken, toToken, amount) => {
		console.log("Fetching Uniswap Fees")
		
		if(fromToken.name.startsWith('USD') && toToken.name.startsWith('USD') || fromToken.name === toToken.name) {
			return amount
		}
		
		const coingeckoName = {
			'MATIC': 'matic-network',
			'ETH': 'ethereum'
		}
		
		var fromTokenPrice

		if(fromToken.name === 'MATIC' || fromToken.name === 'ETH') {
			fromTokenPrice = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoName[fromToken.name]}&vs_currencies=usd`)
			fromTokenPrice = await fromTokenPrice.json()
			fromTokenPrice = fromTokenPrice[coingeckoName[fromToken.name]].usd
			fromTokenPrice = fromTokenPrice * amount
		}
		else fromTokenPrice = amount

		if(toToken.name === 'MATIC') {
			var toTokenPrice = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['matic'].usd
			
			console.log("Uniswap Fees -> ", (amount * Number(toTokenPrice)) - ((amount * Number(toTokenPrice)) * 0.003))
			return (amount * Number(toTokenPrice)) - ((amount * Number(toTokenPrice)) * 0.003)
		} else if (toToken.name === 'ETH') {
			var toTokenPrice = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['ethereum'].usd
			
			console.log("Uniswap Feesx -> ", (fromTokenPrice / Number(toTokenPrice)))
			return ((fromTokenPrice - ((Number(fromTokenPrice)) * 0.003)) / Number(toTokenPrice))
		} else if (toToken.name.startsWith('USD')) {
			console.log("Uniswap Fees -> ", (amount * Number(fromTokenPrice)) - (Number(fromTokenPrice) * 0.003))
			return (amount * Number(fromTokenPrice)) - (Number(fromTokenPrice) * 0.003)
		}
	}

    const approve = async (tokenAddress, address, signer, amount) => {
		const userAddress = await signer.getAddress()
		
		const erc20 = new ethers.Contract(tokenAddress, ERC20abi, signer)
		await erc20.approve(address, ethers.utils.parseUnits(amount, 6))
	}

    const swapTokens = async (tokenIn, tokenOut, amountIn, signer) => {
        const Uniswap = '0xd81662a019fa9c5ab19248a5ac73570ad2a1b7cc'
        const UniswapContract = new ethers.Contract(Uniswap, abi, signer)
		if(tokenIn === NATIVE_ADDRESS) {
			const tx = await UniswapContract.swapExactEthToERC20(tokenOut, {value: amountIn})
		} else {
			await approve(tokenIn, Uniswap, signer, amountIn)
			const tx = await UniswapContract.swapExactInputERC20(tokenIn, tokenOut, amountIn)
		}
    }

    const getPair = (tokenIn, tokenOut, provider) => {
        const uniswapFactory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
        const Factory = new ethers.Contract(uniswapFactory, factoryAbi, provider)
        //const tx = Factory.getPair(tokenIn, tokenOut)
    }   

    const wrapETH = async (amount, signer) => {
        const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        const WETHContract = new ethers.Contract(WETH, WETHabi, signer)
        await WETHContract.deposit({value: ethers.utils.parseEther(amount)})
    }

    const unwrapWETH = async (amount) => {
        const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        const WETHContract = new ethers.Contract(WETH, WETHabi, signer)
        await WETHContract.withdraw(amount)
    }

    return [swapTokens, getAmountOut]
}

export default useUniswap
