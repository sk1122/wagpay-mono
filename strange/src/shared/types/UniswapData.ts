import { Token } from "./Token";

export interface UniswapData {
	dex: string
	amountToGet: number
	fees: number
	chainId: number
	fromToken: Token 
	toToken: Token
}