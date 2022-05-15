import { Token } from "./Token";

export interface UniswapData {
	amountToGet: number
	fees: number
	chainId: number
	fromToken: Token 
	toToken: Token
}