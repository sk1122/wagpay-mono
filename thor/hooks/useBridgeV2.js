import { Chain } from "@hop-protocol/sdk"
import route from "../routes/route2.json"
import useHop from "./useHop"
import useHyphen from "./useHyphen"
import { ethers } from "ethers"

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
	const [getTransferFees] = useHyphen()
	const [get] = useHop()
	
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
			
			var routes = route.available_routes[fromChain.toString()][fromToken.name][toChain.toString()]

			if(!routes) {
				reject("No Route Found")
				return
			}

			if(UNISWAP_REQUIRED) {
				const swappedToken = token[fromChain][toToken.name]

				for(let i = 0; i < routes.length; i++) {
					var fees;
					try {
						fees = await getRouteFees(routes[i], fromChain, toChain, swappedToken, toToken, ethers.utils.parseUnits(amount, fromToken.decimals), signer)
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
						fromTokenAddress: swappedToken, 
						toTokenAddress: toToken, 
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
					routes[i].uniswapData = {
						chainId: fromChain,
						fromTokenAddress: swappedToken, 
						toTokenAddress: toToken, 
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

	return [chooseBridge]
}

export default useBridgeV2