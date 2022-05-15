import route from "@shared/routes"
import tokens, { chainsSupported } from "@shared/tokens"
import { Token } from "@shared/types/Token"
import { UniswapData } from "@shared/types/UniswapData"
import { ethers } from "ethers"
import HyphenProvider from "./bridges/HyphenProvider"
import fetch from "cross-fetch"

const hyphen = new HyphenProvider()

class Bridges {
	getRoutes = (fromChain: string, fromToken: Token, toChain: string): any => {
		const routes = route.available_routes[fromChain][fromToken.name][toChain]
		
		if(!routes) {
			throw "No Route Found"
		}
		return routes
	}

	getUniswapRoute = async (fromToken: Token, toToken: Token, amount: number): Promise<UniswapData> => {
		console.log("Fetching Uniswap Fees")
		
		const swappedToken = tokens[fromToken.chainId][toToken.name]

		let uniswapData: UniswapData = {
			fees: 0,
			chainId: fromToken.chainId,
			fromToken: fromToken, 
			toToken: swappedToken, 
			amountToGet: amount
		}

		if(fromToken.name.startsWith('USD') && toToken.name.startsWith('USD') || fromToken.name === toToken.name) {
			return uniswapData
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
			console.log(fromTokenPrice, amount, "das")
			fromTokenPrice = fromTokenPrice * amount
		}
		else fromTokenPrice = amount

		if(toToken.name === 'MATIC') {
			let toTokenPrice: any = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['matic-network'].usd
			
			uniswapData.amountToGet = (amount * Number(toTokenPrice)) - ((amount * Number(toTokenPrice)) * 0.003)
			uniswapData.fees = ((amount * Number(toTokenPrice)) * 0.003)
		} else if (toToken.name === 'ETH') {
			let toTokenPrice: any = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['ethereum'].usd
			
			uniswapData.amountToGet = ((fromTokenPrice - ((Number(fromTokenPrice)) * 0.003)) / Number(toTokenPrice))
			uniswapData.fees = (Number(fromTokenPrice)) * 0.003
		} else if (toToken.name.startsWith('USD')) {
			console.log(fromTokenPrice)
			uniswapData.amountToGet = (Number(fromTokenPrice)) - (Number(fromTokenPrice) * 0.003)
			uniswapData.fees = (Number(fromTokenPrice) * 0.003)
		}
		return uniswapData
	}

	getRouteFees = async (route: any, fromChain: number, toChain: number, fromToken: Token, toToken: Token, amount: any) => {
		if(route.name === 'HYPHEN') {
			try {
				const fees = await hyphen.getTransferFees(fromChain, toChain, fromToken, amount)
				return fees
			} catch (E) {
				throw E
			}
		} else {
			// const fees = await get(chains[fromChain], chains[toChain], fromToken, amount, signer)
			// return fees
			let fees = {
				gas: 0,
				amountToGet: 0,
				transferFee: 0,
				transferFeePerc: 0
			}
			return fees
		}
	}
	
	bestBridge = async (fromChainId: string, toChainId: string, fromTokenAddress: string, toTokenAddress: string, amount: string): Promise<Array<any>> => {
		return new Promise(async (resolve, reject) => {
			const fromChain = fromChainId as chainsSupported
			const toChain = toChainId as chainsSupported
			const fromTokenA = fromTokenAddress as string
			const toTokenA = toTokenAddress as string
	
			const fromToken: Token = tokens[fromChain][fromTokenA]
			const toToken: Token = tokens[toChain][toTokenA]

			console.log(fromToken, toToken)
	
			const UNISWAP_REQUIRED = fromToken.name !== toToken.name
	
			const routes = this.getRoutes(fromChain, fromToken, toChain)
	
			if(UNISWAP_REQUIRED) {
				console.log(Number(ethers.utils.formatUnits(amount, fromToken.decimals).toString()), amount, fromToken.decimals)
				const uniswapRoute = await this.getUniswapRoute(fromToken, toToken, Number(ethers.utils.formatUnits(amount, fromToken.decimals).toString()))
				
				for(let i = 0; i < routes.length; i++) {
					var fees: any;
					try {
						fees = await this.getRouteFees(routes[i], Number(fromChain), Number(toChain), uniswapRoute.toToken, toToken, ethers.utils.parseUnits(uniswapRoute.amountToGet.toFixed(3).toString(), uniswapRoute.toToken.decimals))
					} catch(e) {
						reject(e)
					}
					routes[i].gasFees = fees.gasFees
					routes[i].amountToGet = fees["amountToGet"]
					routes[i].transferFee = fees["transferFee"]
					routes[i].uniswapData = uniswapRoute
					routes[i].route = {
						fromChain: fromChain,
						toChain: toChain,
						fromToken: uniswapRoute.toToken,
						toToken: toToken,
						amount: uniswapRoute.amountToGet
					}
				}
	
				const sorted = routes.sort((x: any, y: any) => {
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
					var fees: any
					try {
						fees = await this.getRouteFees(routes[i], Number(fromChain), Number(toChain), fromToken, toToken, ethers.utils.parseUnits(amount.toString(), fromToken.decimals))
						console.log(fees, "dsa")
					} catch(e) {
						reject(e)
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
	
				const sorted = routes.sort((x: any, y: any) => {
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
}

export default Bridges