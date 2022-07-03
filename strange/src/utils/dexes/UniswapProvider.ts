import { Token, UniswapData } from "@wagpay/types";
import fetch from "cross-fetch";

class UniswapProvider {
	_getUniswapRoute = async (
		fromToken: Token,
		toToken: Token,
		amount: number
	): Promise<UniswapData> => {
		let uniswapData: UniswapData = {
			dex: "0x7cBBc355A50e19A58C2D8C24Be46Eef03093EDf7",
			fees: 0,
			chainId: Number(fromToken.chainId.toString()),
			fromToken: fromToken,
			toToken: toToken,
			amountToGet: amount,
		};
		console.log(toToken, fromToken);
		if (
			(fromToken.chainAgnositcId.startsWith("USD") &&
				toToken.chainAgnositcId.startsWith("USD")) ||
			fromToken.chainAgnositcId === toToken.chainAgnositcId
		) {
			return uniswapData;
		}

		const coingeckoName = {
			MATIC: "matic-network",
			ETH: "ethereum",
		};

		var fromTokenPrice;

		if (
			fromToken.chainAgnositcId === "MATIC" ||
			fromToken.chainAgnositcId === "ETH"
		) {
			fromTokenPrice = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=${
					coingeckoName[fromToken.chainAgnositcId]
				}&vs_currencies=usd`
			);
			console.log(fromTokenPrice);
			fromTokenPrice = await fromTokenPrice.json();
			console.log(fromTokenPrice);
			fromTokenPrice =
				fromTokenPrice[coingeckoName[fromToken.chainAgnositcId]].usd;
			console.log(fromTokenPrice);
			fromTokenPrice = fromTokenPrice * amount;
		} else fromTokenPrice = amount;

		if (toToken.chainAgnositcId === "MATIC") {
			let toTokenPrice: any = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd`
			);
			console.log(toTokenPrice);
			toTokenPrice = await toTokenPrice.json();
			console.log(toTokenPrice);
			toTokenPrice = toTokenPrice["matic-network"].usd;
			console.log(toTokenPrice);

			uniswapData.amountToGet = fromTokenPrice / toTokenPrice;
			uniswapData.fees =
				uniswapData.amountToGet * Number(toTokenPrice) * 0.003;
		} else if (toToken.chainAgnositcId === "ETH") {
			let toTokenPrice: any = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
			);
			console.log(toTokenPrice);
			toTokenPrice = await toTokenPrice.json();
			console.log(toTokenPrice);
			toTokenPrice = toTokenPrice["ethereum"].usd;
			console.log(toTokenPrice);

			uniswapData.amountToGet =
				(fromTokenPrice - Number(fromTokenPrice) * 0.003) /
				Number(toTokenPrice);
			uniswapData.fees = Number(fromTokenPrice) * 0.003;
		} else if (toToken.chainAgnositcId.startsWith("USD")) {
			console.log(fromTokenPrice);
			uniswapData.amountToGet =
				Number(fromTokenPrice) - Number(fromTokenPrice) * 0.003;
			uniswapData.fees = Number(fromTokenPrice) * 0.003;
		}
		return uniswapData;
	};

	getUniswapRoute = async (
		fromToken: Token,
		toToken: Token,
		amount: number
	): Promise<UniswapData> => {
		return this._getUniswapRoute(fromToken, toToken, amount);
	};
}

export default UniswapProvider;
