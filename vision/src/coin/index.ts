import { ChainId } from "../chain"
import { CoinKey } from "./coin.enum"

export type chainsSupported = "1" | "137"
export type tokensSupported = "ETH" | "WETH" | "USDC" | "USDT" | "MATIC"

export interface Token {
	name: CoinKey
	address: string
	decimals: number
	chainId: ChainId
}

export interface ChainTokens {
	[key: string]: Token
}

export interface Tokens {
	[key: number]: ChainTokens
}

export const tokens: Tokens = {
	1: {
		"ETH": {name:CoinKey.ETH,address:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',decimals:18,chainId:ChainId.ETH},
		'WETH': {name:CoinKey.WETH,address:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',decimals:18,chainId:ChainId.ETH},
		'USDC': {name:CoinKey.USDC,address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',decimals:6,chainId:ChainId.ETH},
		'USDT': {name:CoinKey.USDT,address:'0xdac17f958d2ee523a2206206994597c13d831ec7',decimals:6,chainId:ChainId.ETH},
		'MATIC': {name:CoinKey.MATIC,address:'0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',decimals:18,chainId:ChainId.ETH},
	},
	137: {
		'ETH': {name:CoinKey.ETH,address:'0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',decimals:18,chainId:ChainId.POL},
		'USDT': {name:CoinKey.USDT,address:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',decimals:6,chainId:ChainId.POL},
		'USDC': {name:CoinKey.USDC,address:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',decimals:6,chainId:ChainId.POL},
		'MATIC': {name:CoinKey.MATIC,address:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',decimals:18,chainId:ChainId.POL}
	}
}

export * from "./coin.enum"
export * from "./coin.type"
