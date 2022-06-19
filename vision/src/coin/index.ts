import { ChainId } from "../chain";
import { CoinKey } from "./coin.enum";

export type chainsSupported = "1" | "137";
export type tokensSupported = "ETH" | "WETH" | "USDC" | "USDT" | "MATIC";

export interface Token {
	chainAgnositcId: CoinKey;
	symbol: string;
	name: string;
	address: string;
	decimals: number;
	chainId: ChainId;
}

export interface ChainTokens {
	[key: string]: Token;
}

export interface Tokens {
	[key: number]: ChainTokens;
}

export const oldTokens: Tokens = {
	1: {
		ETH: {
			chainAgnositcId: CoinKey.ETH,
			symbol: "ETH",
			name: 'Ethereum',
			address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			decimals: 18,
			chainId: ChainId.ETH,
		},
		WETH: {
			chainAgnositcId: CoinKey.WETH,
			symbol: "WETH",
			name: 'Wrapped Ethereum',
			address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
			decimals: 18,
			chainId: ChainId.ETH,
		},
		USDC: {
			chainAgnositcId: CoinKey.USDC,
			symbol: "USDC",
			name: 'USD Coin',
			address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
			decimals: 6,
			chainId: ChainId.ETH,
		},
		USDT: {
			chainAgnositcId: CoinKey.USDT,
			symbol: "USDT",
			name: 'Tether USD',
			address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
			decimals: 6,
			chainId: ChainId.ETH,
		},
		MATIC: {
			chainAgnositcId: CoinKey.MATIC,
			symbol: "MATIC",
			name: 'Wrapped Matic',
			address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
			decimals: 18,
			chainId: ChainId.ETH,
		},
		AVAX: {
			chainAgnositcId: CoinKey.AVAX,
			symbol: "AVAX",
			name: 'Wrapped Avalanche',
			address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
			decimals: 18,
			chainId: ChainId.ETH,
		},
	},
	137: {
		ETH: {
			chainAgnositcId: CoinKey.ETH,
			symbol: "WETH",
			name: 'Wrapped Ethereum',
			address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
			decimals: 18,
			chainId: ChainId.POL,
		},
		USDT: {
			chainAgnositcId: CoinKey.USDT,
			symbol: "USDT",
			name: 'Tether USD',
			address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
			decimals: 6,
			chainId: ChainId.POL,
		},
		USDC: {
			chainAgnositcId: CoinKey.USDC,
			symbol: "USDC",
			name: 'USD Coin',
			address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
			decimals: 6,
			chainId: ChainId.POL,
		},
		MATIC: {
			chainAgnositcId: CoinKey.MATIC,
			symbol: "MATIC",
			name: 'Matic',
			address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			decimals: 18,
			chainId: ChainId.POL,
		}
	},
	56: {
		ETH: {
			chainAgnositcId: CoinKey.ETH,
			symbol: "WETH",
			name: 'Wrapped Ethereum',
			address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
			decimals: 18,
			chainId: ChainId.BSC,
		},
		USDT: {
			chainAgnositcId: CoinKey.USDT,
			symbol: "USDT",
			name: 'Tether USD',
			address: "0x55d398326f99059ff775485246999027b3197955",
			decimals: 6,
			chainId: ChainId.BSC,
		},
		USDC: {
			chainAgnositcId: CoinKey.USDC,
			symbol: "USDC",
			name: 'USD Coin',
			address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
			decimals: 6,	
			chainId: ChainId.BSC,
		},
		BNB: {
			chainAgnositcId: CoinKey.BNB,
			symbol: "BNB",
			name: 'BNB',
			address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			decimals: 18,
			chainId: ChainId.BSC,
		},
	},
	43114: {
		ETH: {
			chainAgnositcId: CoinKey.ETH,
			symbol: "AVAX",
			name: 'Wrapped Avalanche',
			address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
			decimals: 18,
			chainId: ChainId.AVA,
		},
		USDT: {
			chainAgnositcId: CoinKey.USDT,
			symbol: "AVAX",
			name: 'Wrapped Avalanche',
			address: "0xc7198437980c041c805a1edcba50c1ce5db95118",
			decimals: 6,
			chainId: ChainId.AVA,
		},
		USDC: {
			chainAgnositcId: CoinKey.USDC,
			symbol: "AVAX",
			name: 'Wrapped Avalanche',
			address: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
			decimals: 6,
			chainId: ChainId.AVA,
		},
		AVAX: {
			chainAgnositcId: CoinKey.AVAX,
			symbol: "AVAX",
			name: 'Wrapped Avalanche',
			address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			decimals: 18,
			chainId: ChainId.AVA,
		},
	},
};

const tokensV2: any = {
	'ETH': {
		chainAgnositcId: CoinKey.ETH,
		symbols: {
			1: "ETH",
			137: "WETH",
			56: "WETH",
			43114: "WETH"
		},
		name: {
			1: "Ethereum",
			137: "Wrapped Ethereum",
			56: "Wrapped Ethereum",
			43114: "Wrapped Ethereum"
		},
		address: {
			1: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			137: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
			56: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
			43114: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB"
		},
		decimals: 18,
		chains: [ChainId.ETH, ChainId.POL, ChainId.BSC, ChainId.AVA],
	},
	'MATIC': {
		chainAgnositcId: CoinKey.MATIC,
		symbols: {
			1: "WMATIC",
			137: "MATIC",
			56: "WMATIC",
			43114: "WMATIC"
		},
		name: {
			1: "Wrapped Matic",
			137: "Matic",
			56: "Wrapped Matic",
			43114: "Wrapped Matic"
		},
		address: {
			1: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
			137: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
			56: "",
			43114: ""
		},
		decimals: 18,
		chains: [ChainId.POL],
	},
	'USDC': {
		chainAgnositcId: CoinKey.USDC,
		symbols: {
			1: "USDC",
			137: "USDC",
			56: "USDC",
			43114: "USDC"
		},
		name: {
			1: "USD Coin",
			137: "USD Coin",
			56: "USD Coin",
			43114: "USD Coin"
		},
		address: {
			1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
			137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
			56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
			43114: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664"
		},
		decimals: 6,
		chains: [ChainId.ETH, ChainId.POL, ChainId.BSC, ChainId.AVA],
	},
	'USDT': {
		chainAgnositcId: CoinKey.USDT,
		symbols: {
			1: "USDT",
			137: "USDT",
			56: "USDT",
			43114: "USDT.E"
		},
		name: {
			1: "Tether USD",
			137: "Tether USD",
			56: "Tether USD",
			43114: "Tether USD"
		},
		address: {
			1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
			137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
			56: "0x55d398326f99059ff775485246999027b3197955",
			43114: "0xc7198437980c041c805a1edcba50c1ce5db95118"
		},
		decimals: 6,
		chains: [ChainId.ETH, ChainId.POL, ChainId.BSC, ChainId.AVA],
	},
	'AVAX': {
		chainAgnositcId: CoinKey.AVAX,
		symbols: {
			1: "WAVAX",
			137: "WAVAX",
			56: "WAVAX",
			43114: "AVAX"
		},
		name: {
			1: "Wrapped Avalanche",
			137: "Wrapped Avalanche",
			56: "Wrapped Avalanche",
			43114: "Wrapped Avalanche"
		},
		address: {
			1: "",
			137: "",
			56: "",
			43114: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
		},
		decimals: 18,
		chains: [ChainId.AVA],
	},
	'BNB': {
		chainAgnositcId: CoinKey.BNB,
		symbols: {
			1: "",
			137: "",
			43114: "",
			56: "BNB"
		},
		name: {
			1: "",
			137: "",
			43114: "",
			56: "BNB"
		},
		address: {
			1: "",
			137: "",
			43114: "",
			56: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
		},
		decimals: 18,
		chains: [ChainId.BSC],
	},
	'DAI': {
		chainAgnositcId: CoinKey.DAI,
		symbols: {
			1: "DAI",
			137: "DAI",
			56: "DAI",
			43114: "DAI"
		},
		name: {
			1: "DAI",
			137: "DAI",
			56: "DAI",
			43114: "DAI"
		},
		address: {
			1: "0x6b175474e89094c44da98b954eedeac495271d0f",
			137: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
			56: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
			43114: "0xba7deebbfc5fa1100fb055a87773e1e99cd3507a"
		},
		decimals: 6,
		chains: [ChainId.ETH, ChainId.POL, ChainId.BSC, ChainId.AVA],
	}
}

const getTokens = () => {
	const supported_tokens: Tokens = {}
	
	const supported_chains = [1, 137, 56, 43114]
	const tokens: string[] = Object.keys(tokensV2)
	for(let i = 0; i < supported_chains.length; i++) {
		supported_tokens[supported_chains[i]] = {} as ChainTokens
		for(let j = 0; j < tokens.length; j++) {
			if(tokensV2[tokens[j]].chains.includes(supported_chains[i])) {
				let token: Token = {} as Token;
				token.name = tokensV2[tokens[j]].name[supported_chains[i]]
				token.symbol = tokensV2[tokens[j]].symbols[supported_chains[i]]
				token.address = tokensV2[tokens[j]].address[supported_chains[i]]
				token.chainAgnositcId = tokensV2[tokens[j]].chainAgnositcId
				token.decimals = tokensV2[tokens[j]].decimals
				token.chainId = supported_chains[i]
				supported_tokens[supported_chains[i]][token.chainAgnositcId] = token
				// console.log(supported_chains[i], tokensV2[tokens[j]].name[supported_chains[i]])
			}
		}
	}
	// console.log(JSON.stringify(supp))
	return supported_tokens
} 

export const tokens = getTokens()

export * from "./coin.enum";
export * from "./coin.type";
export * from "./coin.obj";
