import { Chain } from "@hop-protocol/sdk"
import route from "../routes/route2.json"
import useHop from "./useHop"
import useHyphen from "./useHyphen"
import { ethers } from "ethers"
import useHyphenV2 from "./useHyphenV2"
import useUniswap from "./useUniswap"

const token = {
	1: {
		'ETH': {name:'ETH',address:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',decimals:18},
		'WETH': {name:'WETH',address:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',decimals:18},
		'USDC': {name:'USDC',address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',decimals:6},
		'USDT': {name:'USDT',address:'0xdac17f958d2ee523a2206206994597c13d831ec7',decimals:6},
		'MATIC': ''
	},
	137: {
		'ETH': {name:'ETH',address:'0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',decimals:18},
		'USDT': {name:'USDT',address:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',decimals:6},
		'USDC': {name:'USDC',address:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',decimals:6},
		'MATIC': {name:'MATIC',address:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',decimals:18}
	}
}

const chains = {
	1: Chain.Ethereum,
	137: Chain.Polygon
}

const useBridgeV2 = () => {
	const [getTransferFees, ] = useHyphen()
	const [get, bridge] = useHop()
	const [bridgeFunds, getFunds] = useHyphenV2()
	const [swapTokens] = useUniswap()
	
	const getRouteFees = async (route, fromChain, toChain, fromToken, toToken, amount, signer) => {
		if(route.name === 'HYPHEN') {
			try {
				const fees = await getTransferFees(fromChain, toChain, fromToken, amount)
				return fees
			} catch (E) {
				throw E
			}
		} else {
			const fees = await get(chains[fromChain], chains[toChain], fromToken, amount, signer)
			return fees
		}
	}
	
	const chooseBridge = async (fromChain, toChain, fromToken, toToken, amount, signer) => {
		return new Promise(async (resolve, reject) => {			
			const UNISWAP_REQUIRED = fromToken.name !== toToken.name
			console.log(fromChain, fromToken, toChain)
			var routes = route.available_routes[fromChain.toString()][fromToken.name][toChain.toString()]

			if(!routes) {
				reject("No Route Found")
				return
			}

			if(UNISWAP_REQUIRED) {
				console.log(fromChain, toToken.name)
				const swappedToken = token[fromChain.toString()][toToken.name]

				for(let i = 0; i < routes.length; i++) {
					var fees;
					try {
						fees = await getRouteFees(routes[i], fromChain, toChain, swappedToken, toToken, ethers.utils.parseUnits(amount, swappedToken.decimals), signer)
					} catch(e) {
						reject(e)
						return
					}
					routes[i].gasFees = fees.gasFees
					routes[i].amountToGet = fees["amountToGet"]
					routes[i].transferFee = fees["transferFee"]
					routes[i].uniswapFees = 0
					routes[i].uniswapData = {
						chainId: fromChain,
						fromTokenAddress: fromToken, 
						toTokenAddress: swappedToken, 
					}
					routes[i].route = {
						fromChain: fromChain,
						toChain: toChain,
						fromToken: swappedToken,
						toToken: toToken,
						amount: amount
					}
				}

				const sorted = routes.sort((x, y) => {
					if(Number(x.amountToGet) < Number(y.amountToGet)) {
						return 1
					} else if(Number(x.gasFees) < Number(y.gasFees)) {
						return 1
					} else {
						return -1
					}
				})

				resolve(sorted)
			} else {
				for(let i = 0; i < routes.length; i++) {
					var fees 
					try {
						fees = await getRouteFees(routes[i], fromChain, toChain, fromToken, toToken, ethers.utils.parseUnits(amount, fromToken.decimals), signer)
					} catch(e) {
						reject(e)
						return
					}
					routes[i].gasFees = fees.gasFees
					routes[i].amountToGet = fees["amountToGet"]
					routes[i].transferFee = fees["transferFee"]
					routes[i].uniswapFees = 0
					routes[i].uniswapData = undefined
					routes[i].route = {
						fromChain: fromChain,
						toChain: toChain,
						fromToken: fromToken,
						toToken: toToken,
						amount: amount
					}
				}

				const sorted = routes.sort((x, y) => {
					if(Number(x.amountToGet) < Number(y.amountToGet)) {
						return 1
					} else if(Number(x.gasFees) < Number(y.gasFees)) {
						return 1
					} else {
						return -1
					}
				})

				resolve(sorted)
			}
		})
	}

	const erc20approve = async (tokenAddress, addressToApprove, amount, signer) => {
		const abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
		const erc20 = new ethers.Contract(tokenAddress, abi, signer)
		await erc20.approve(addressToApprove, amount)
	}

	const executeRoute = async (route, signer) => {
		return new Promise(async (resolve, reject) => {
			const address = await signer.getAddress()
			const abi = [{"inputs":[{"internalType":"address","name":"_hyphen","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"ERC20FundsTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"}],"name":"NativeFundsTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferNative","outputs":[],"stateMutability":"payable","type":"function"}]
			if(route.uniswapData) {
				// TODO: Implement erc20approve
				await erc20approve(route.route.fromToken.address, route.contractAddress, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), signer)
				
				await swapTokens(route.uniswapData.fromTokenAddress.address, route.uniswapData.toTokenAddress.address, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), signer)
				
				const contract = new ethers.Contract(route.contractAddress, abi, signer)
				await contract.transferERC20(route.route.fromChain, route.route.fromToken.address, address, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), 'WAGPAY')
				if(route.name == 'HYPHEN') {
					await getFunds(ethereum, route.toToken.address, ethers.utils.parseUnits(route.route.amount, route.route.toToken.decimals), signer)
				} else if(route.name == 'HOP') {
					await bridge(route.route.fromChain, route.route.toChain, route.route.fromToken.address, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), signer)
				}
				resolve()
			} else {
				// TODO: Implement erc20approve
				await erc20approve(route.route.fromToken.address, route.contractAddress, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), signer)
				const contract = new ethers.Contract(route.contractAddress, abi, signer)
				await contract.transferERC20(route.route.fromChain, route.route.fromToken.address, address , ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), 'WAGPAY')
				if(route.name == 'HYPHEN') {
					await getFunds(ethereum, route.toToken.address, ethers.utils.parseUnits(route.route.amount, route.route.toToken.decimals), signer)
				} else if(route.name == 'HOP') {
					await bridge(route.route.fromChain, route.route.toChain, route.route.fromToken.address, ethers.utils.parseUnits(route.route.amount, route.route.fromToken.decimals), signer)
				}
				resolve()
			}
		})
	}

	return [chooseBridge, executeRoute]
}

export default useBridgeV2