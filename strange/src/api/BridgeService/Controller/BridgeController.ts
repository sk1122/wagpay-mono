import express, { Request, Response } from "express"
import tokens, { chainsSupported, tokensSupported } from "@shared/tokens"
import route from "@shared/routes"
import { Token } from "@shared/types/Token"
import { ethers } from "ethers"
import fetch from "cross-fetch"

class BridgeController {
	getAmountOut = async (fromToken: Token, toToken: Token, amount: number): Promise<number> => {
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
			let toTokenPrice: any = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['matic'].usd
			
			console.log("Uniswap Fees -> ", (amount * Number(toTokenPrice)) - ((amount * Number(toTokenPrice)) * 0.003))
			return (amount * Number(toTokenPrice)) - ((amount * Number(toTokenPrice)) * 0.003)
		} else if (toToken.name === 'ETH') {
			let toTokenPrice: any = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
			toTokenPrice = await toTokenPrice.json()
			toTokenPrice = toTokenPrice['ethereum'].usd
			
			console.log("Uniswap Feesx -> ", (fromTokenPrice / Number(toTokenPrice)))
			return ((fromTokenPrice - ((Number(fromTokenPrice)) * 0.003)) / Number(toTokenPrice))
		} else if (toToken.name.startsWith('USD')) {
			console.log("Uniswap Fees -> ", (Number(fromTokenPrice)) - (Number(fromTokenPrice) * 0.003))
			return (Number(fromTokenPrice)) - (Number(fromTokenPrice) * 0.003)
		}
		return 0
	}

	getTransferFees = async (fromChainId: number, toChainId: number, token: Token, amount: any) => {
		const HYPHEN_BASE_URL = "https://hyphen-v2-api.biconomy.io/api/v1"
		try {
			const res = await fetch(`${HYPHEN_BASE_URL}/data/transferFee?fromChainId=${fromChainId}&toChainId=${toChainId}&tokenAddress=${token.address}&amount=${amount}`)
			if(res.status >= 400) throw "Error 404"
			const data = await res.json()
			
			let fees = {
				gas: data["gasFee"],
				amountToGet: data["amountToGet"],
				transferFee: data["transferFee"],
				transferFeePerc: data["transferFeePercentage"]
			}
			console.log(data, fees)
			// console.log(data, "DATA")
			return fees
		} catch (e) {
			return e
		}
	}

	getRouteFees = async (route: any, fromChain: number, toChain: number, fromToken: Token, toToken: Token, amount: any) => {
		if(route.name === 'HYPHEN') {
			try {
				const fees = await this.getTransferFees(fromChain, toChain, fromToken, amount)
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
	
	bestBridge = async (req: Request, res: Response) => {
		const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount } = req.query

		if(!fromChainId || !toChainId || !fromTokenAddress || !toTokenAddress || !amount) {
			res.status(400).send({
				error: "Send fromChain, toChain, fromTokenAddress, toTokenAddress",
				status: 400
			})
			return
		}

		const fromChain = fromChainId as chainsSupported
		const toChain = toChainId as chainsSupported
		const fromTokenA = fromTokenAddress as string
		const toTokenA = toTokenAddress as string

		const fromToken: Token = tokens[fromChain][fromTokenA]
		const toToken: Token = tokens[toChain][toTokenA]

		console.log("Choosing Bridge...")
			const UNISWAP_REQUIRED = fromToken.name !== toToken.name
			var routes = route.available_routes[fromChain][fromToken.name][toChain]

			if(!routes) {
				res.status(400).send({
					error: "No Route found",
					status: 400
				})
				return
			}

			if(UNISWAP_REQUIRED) {
				console.log("YO")
				const value = await this.getAmountOut(fromToken, toToken, Number(amount))
				console.log(tokens[fromChain][toToken.name])
				const swappedToken = tokens[fromChain][toToken.name]
				
				for(let i = 0; i < routes.length; i++) {
					console.log("YO")
					var fees: any;
					console.log("free -> ", value, ethers.utils.parseUnits(value.toFixed(3).toString(), swappedToken.decimals))
					try {
						fees = await this.getRouteFees(routes[i], Number(fromChain), Number(toChain), swappedToken, toToken, ethers.utils.parseUnits(value.toFixed(3).toString(), swappedToken.decimals))
					} catch(e) {
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
						amount: value
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

				res.status(200).send(sorted)
			} else {
				console.log("dsa")
				for(let i = 0; i < routes.length; i++) {
					var fees: any
					try {
						fees = await this.getRouteFees(routes[i], Number(fromChain), Number(toChain), fromToken, toToken, ethers.utils.parseUnits(amount.toString(), fromToken.decimals))
						console.log(fees, "dsa")
					} catch(e) {
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

				const sorted = routes.sort((x: any, y: any) => {
					if(Number(x.amountToGet) < Number(y.amountToGet)) {
						return 1
					} else if(Number(x.gasFees) < Number(y.gasFees)) {
						return 1
					} else {
						return -1
					}
				})

				res.status(200).send(sorted)
			}
	}
}

export default BridgeController