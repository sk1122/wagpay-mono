import { BigNumber, ethers } from "ethers"
import useHyphen from "./useHyphen"
import rpc from "../routes/rpc.json"
import route from "../routes/route2.json"
import useHop from "./useHop"
import { Chain } from "@hop-protocol/sdk"
import { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, TradeType, Percent, CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi'
import { useAccountContext } from "../context"

const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const tokenNames = {
	1: {
		'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
		'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'WETH',
		'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
		'0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
		'': 'MATIC'
	},
	137: {
		'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'MATIC',
		'0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT',
		'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
		'0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': 'ETH'
	}
}

const tokenAddress = {
	1: {
		'ETH': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
		'MATIC': ''
	},
	137: {
		'ETH': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
		'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
		'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
		'MATIC': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
	}
}

const chains = {
	1: Chain.Ethereum,
	137: Chain.Polygon
}


const useBridge = () => {
	const [getTransferFees, bridge] = useHyphen()
	const [get, b] = useHop()

	const { signer } = useAccountContext()
	
	const checkLowGasFees = async (chainId1, chainId2) => {
		const provider1 = new ethers.providers.JsonRpcProvider(rpc[chainId1].rpc[0])
		const provider2 = new ethers.providers.JsonRpcProvider(rpc[chainId2].rpc[0])
		
		const gas1 = Number(ethers.utils.formatUnits(await provider1.getGasPrice(), 'gwei')) / 1000000000
		const gas2 = Number(ethers.utils.formatUnits(await provider2.getGasPrice(), 'gwei')) / 1000000000

		let data = await fetch(rpc[chainId1].price)
		const price1 = await data.json()

		data = await fetch(rpc[chainId2].price)
		const price2 = await data.json()
		
		return (gas1 * price1[rpc[chainId1].key].usd) <= (gas2 * price2[rpc[chainId2].key].usd)
	} 
	
	const findUniswapRoute = async (chainId, fromTokenAddress, toTokenAddress, amount) => {
		const provider = new ethers.providers.JsonRpcProvider(rpc[chainId].rpc[0])

		const router = new AlphaRouter({ chainId: chainId, provider: provider })

		var fromTokenName, toTokenName
		if(fromTokenAddress === NATIVE_ADDRESS) {
			fromTokenName = 'W' + tokenNames[chainId][fromTokenAddress]
			fromTokenAddress = tokenAddress[chainId][fromTokenName]
		} else {
			fromTokenName = tokenNames[chainId][fromTokenAddress]
		}
		if(toTokenAddress === NATIVE_ADDRESS) {
			toTokenName = 'W' + tokenNames[chainId][toTokenAddress]
			toTokenAddress = tokenAddress[chainId][toTokenName]
		} else {
			toTokenName = tokenNames[chainId][toTokenAddress]
		}

		const fromToken = new Token(chainId, fromTokenAddress, 18, fromTokenName, 'Wrapped Ether')
		const toToken = new Token(chainId, toTokenAddress, 6, toTokenName, 'USD//C')

		const currencyAmount = CurrencyAmount.fromRawAmount(fromToken, amount)

		const route = await router.route(currencyAmount, toToken, TradeType.EXACT_INPUT, {
			recipient: '0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46',
			slippageTolerance: new Percent(5, 100),
			deadline: Math.floor(Date.now() / 1000 + 1800),
		})
	}

	const getUniswapFees = async (amount) => {
		return (0.3 / 100) * Number(amount)
	}

	const getRouteFees = async (route, fromChainId, toChainId, fromTokenAddress, tokenAddress, amount, fromDecimal, toDecimal) => {
		if(route.name === 'HYPHEN') {
			try {
				const fees = await getTransferFees(fromChainId, toChainId, fromTokenAddress, amount)
				return fees
			} catch (E) {
				throw E
			}
		} else {
			console.log(fromDecimal, toDecimal, fromTokenAddress, fromChainId)
			const fees = await get(chains[fromChainId], chains[toChainId], fromTokenAddress, amount, signer, fromDecimal, toDecimal)
			return fees
		}
	}
	
	const chooseBridge = (fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount, fromToken, toToken) => {
		return new Promise(async (resolve, reject) => {
			const fromTokenName = tokenNames[fromChainId][fromTokenAddress]
			const toTokenName = tokenNames[toChainId][toTokenAddress]
			const UNISWAP_REQUIRED = fromTokenName !== toTokenName
			var routes = route.available_routes[fromChainId][fromTokenName][toChainId]
	
			if(routes.length <= 0) {
				reject("No Route Found")
				return
			}

			if(UNISWAP_REQUIRED) {
				// TODO: Implement checkLowGasFees
				const uniswapBeforeBridge = await checkLowGasFees(fromChainId, toChainId)

				const uniswapFees = await getUniswapFees(
					amount
				)

				for(let i = 0; i < routes.length; i++) {
					// TODO: Implement getRouteFees
					var fees
					try {
						console.log(11)
						if(uniswapBeforeBridge) {
							fees = await getRouteFees(routes[i], fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount, fromToken.decimals, toToken.decimals)
						} else {
							console.log(fromTokenAddress)
							fees = await getRouteFees(routes[i], fromChainId, toChainId, fromTokenAddress, fromTokenAddress, amount, toToken.decimals, fromToken.decimals)
						}
					} catch (e) {
						fees = await getRouteFees(routes[i], fromChainId, toChainId, tokenAddress[fromChainId][toTokenName], toTokenAddress, amount, fromToken.decimals, toToken.decimals)
					}

					routes[i].gasFees = fees.gasFees
					routes[i].amountToGet = fees["amountToGet"]
					routes[i].transferFee = fees["transferFee"]
					routes[i].uniswapFees = uniswapFees
					routes[i].uniswapData = {
						chainId: uniswapBeforeBridge ? fromChainId : toChainId,
						fromTokenAddress: uniswapBeforeBridge ? fromTokenAddress : tokenAddress[toChainId][fromTokenName], 
						toTokenAddress: uniswapBeforeBridge ? tokenAddress[fromChainId][toTokenName] : toTokenAddress, 
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
					// TODO: Implement getRouteFees
					const fees = await getRouteFees(routes[i], fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount, fromToken.decimals, toToken.decimals)
					
					routes[i].gasFees = fees.gas
					routes[i].amountToGet = fees["amountToGet"]
					routes[i].transferFee = fees["transferFee"]
					routes[i].uniswapFees = false
					routes[i].uniswapData = {}
				}

				const sorted = routes.sort((x, y) => {
					if(Number(x.amountToGet) < Number(y.amountToGet)) {
						return -1
					} else if(Number(x.gasFees) < Number(y.gasFees)) {
						return -1
					} else {
						return 1
					}
				})

				resolve(sorted)
			}
		})
	}

	return [chooseBridge, getUniswapFees]
}

export default useBridge