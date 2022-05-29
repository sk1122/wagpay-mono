import { ChainId } from "./chain/chain.enum"
import { CoinKey } from "./coin/coin.enum"

export enum Bridges {
	"hop" = "HOP",
	"hyphen" = "HYPHEN",
	"wormhole" = "wormhole"
}

export enum Dexes {
	"uniswap" = "uniswap",
	"0inch" = "0inch"
}

export interface ExecuteRouteData {
	name: string
	bridgeTime: string
	contractAddress: string
	amountToGet: string
	transferFee: string
	uniswapData: UniswapData
	route: RouteResponse
}

export interface AllowDenyPrefer {
	allow?: string[]
	deny?: string[]
	prefer?: string[]
}

export interface RouteData {
	fromChain: ChainId
	toChain: ChainId
	fromToken: CoinKey
	toToken: CoinKey
	amount: string
	bridge?: AllowDenyPrefer
	dex?: AllowDenyPrefer
}

export interface Token {
	name: CoinKey,
	address: string,
	decimals: number,
	chainId: ChainId
}

export interface RouteResponse {
	fromChain: string
	toChain: string
	fromToken: Token
	toToken: Token
	amount: number
}

export interface UniswapData {
	dex: string,
	fees: number,
	chainId: number,
	fromToken: Token,
	toToken: Token,
	amountToGet: number
}

export interface Routes {
	name: string
	bridgeTime: string
	contractAddress: string
	amountToGet: string
	transferFee: string
	uniswapData: UniswapData
	route: RouteResponse
}