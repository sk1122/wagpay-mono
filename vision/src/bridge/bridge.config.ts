import { tokens } from "../coin";
import { ChainId } from "../chain";
import { CoinKey } from "../coin";

enum BridgeId {
	Hyphen = "Hyphen",
	Hop = "Hop",
	Celer = "Celer",
}

enum DexId {
	Uniswap = "Uniswap",
}

interface FeesInterface {
	gasFees: string;
	amountToGet: string;
	transferFee: string;
	bridgeTime: string;
}

interface Bridge {
	logoUri: string;
	name: BridgeId;
	contract: any;
	supported_chains: ChainId[];
	supported_coins: CoinKey[];
}

interface Dex {
	logoUri: string;
	name: DexId;
	contract: string;
	supported_chains: ChainId[];
	supported_coins: CoinKey[];
}

export const bridges: Bridge[] = [
	{
		logoUri: "",
		name: BridgeId.Hyphen,
		contract: {
			1: "",
			137: "0xf0AdF157c4E7b92FfeAb045816560F41ff930DD2",
			43114: "",
			56: "",
		},
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [
			CoinKey.AVAX,
			CoinKey.ETH,
			CoinKey.USDC,
			CoinKey.USDT,
		],
	},
	{
		logoUri: "",
		name: BridgeId.Hop,
		contract: {
			1: "",
			137: "0xcC5a4A7d908CB869a890051aA7Ba12E9719F2AFb",
			43114: "",
			56: "",
		},
		supported_chains: [ChainId.ETH, ChainId.POL],
		supported_coins: [
			CoinKey.DAI,
			CoinKey.MATIC,
			CoinKey.ETH,
			CoinKey.USDC,
			CoinKey.USDT,
		],
	},
	{
		logoUri: "",
		name: BridgeId.Celer,
		contract: {
			1: "",
			137: "0x138C20AAc0e1602a92eCd2BF4634098b1d5765f1",
			43114: "",
			56: "",
		},
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [
			CoinKey.MATIC,
			CoinKey.ETH,
			CoinKey.USDC,
			CoinKey.USDT,
		],
	},
];

export const dexes: Dex[] = [
	{
		logoUri: "",
		name: DexId.Uniswap,
		contract: "0xf9Eb876d23DEA670f984c9F2A52c8B51De67157d",
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [
			CoinKey.AVAX,
			CoinKey.MATIC,
			CoinKey.ETH,
			CoinKey.USDC,
			CoinKey.USDT,
			CoinKey.BNB,
		],
	},
];

export const wagpayBridge: { [key: number]: string } = {
	1: "",
	137: "0xB8f0B05516B7675632f5BeecCf9320aEf2C90982",
	56: "",
	43114: "",
};
