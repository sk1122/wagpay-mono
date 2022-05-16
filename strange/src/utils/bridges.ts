import route from "@shared/routes"
import tokens, { chainsSupported } from "@shared/tokens"
import { Token } from "@shared/types/Token"
import { UniswapData } from "@shared/types/UniswapData"
import { ethers } from "ethers"
import HopProvider from "./bridges/HopProvider"
import HyphenProvider from "./bridges/HyphenProvider"
import UniswapProvider from "./dexes/UniswapProvider"

const hyphen = new HyphenProvider()
const uniswap = new UniswapProvider()
const hop = new HopProvider()

class Bridges {
	getRoutes = (fromChain: string, fromToken: Token, toChain: string): any => {
		const routes = route.available_routes[fromChain][fromToken.name][toChain]
		
		if(!routes) {
			throw "No Route Found"
		}
		return routes
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
			const fees = await hop.getTransferFees(fromChain, toChain, fromToken, amount)
			return fees
			// let fees = {
			// 	gas: 0,
			// 	amountToGet: 0,
			// 	transferFee: 0,
			// 	transferFeePerc: 0
			// }
			// return fees
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
	
			const UNISWAP_REQUIRED = fromToken.name !== toToken.name
	
			const routes = this.getRoutes(fromChain, fromToken, toChain)
	
			if(UNISWAP_REQUIRED) {
				const uniswapRoute = await uniswap.getUniswapRoute(fromToken, toToken, Number(ethers.utils.formatUnits(amount, fromToken.decimals).toString()))
				
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