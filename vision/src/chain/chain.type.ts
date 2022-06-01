import { CoinKey } from "../coin/coin.enum";
import { Coin } from "../coin/coin.type";
import { ChainId, Chains, ChainType } from "./chain.enum";

export interface Chain {
	chain: Chains
	type: ChainType,
	coinSupported: CoinKey[]
	logoUri: string
	id: ChainId
	chainName: string
}