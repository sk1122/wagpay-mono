import { CoinKey } from "./coin.enum";

export interface Coin {
	logoUri: string,
	coinKey: CoinKey,
	coinName: string
}