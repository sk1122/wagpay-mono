import { ChainId } from "../chain/chain.enum"
import { CoinKey } from "../coin/coin.enum"
import { BridgeId, DexId } from "./bridge.enum"

export interface FeesInterface {
	gasFees: string
	amountToGet: string
	transferFee: string
}

export interface Bridge {
	logoUri: string
	name: BridgeId
	contract: string
	supported_chains: ChainId[]
	supported_coins: CoinKey[]
	getTransferFees: (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, amount: string) => Promise<FeesInterface>
}

export interface Dex {
	logoUri: string
	name: DexId
	contract: string
	supported_chains: ChainId[]
	supported_coins: CoinKey[]
}
