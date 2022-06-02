import tokens from "@shared/tokens"
import { Token, UniswapData } from "@wagpay/types"
import fetch from "cross-fetch"

class UniswapProvider {
	_getUniswapRoute = async (fromToken: Token, toToken: Token, amount: number): Promise<UniswapData> => {
		let uniswapData: UniswapData = {
			dex: '0xd81662a019fA9C5ab19248a5ac73570Ad2a1b7cc',
			fees: 0,
			chainId: Number(fromToken.chainId.toString()),
			fromToken: fromToken, 
			toToken: toToken, 
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
	
	getUniswapRoute = async (fromToken: Token, toToken: Token, amount: number): Promise<UniswapData> => {		
		const swappedToken = tokens[fromToken.chainId][toToken.name]

		return this._getUniswapRoute(fromToken, swappedToken, amount)
	}
}

export default UniswapProvider