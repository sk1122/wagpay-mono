import { CoinKey } from "./coin.enum";

export const coinEnum: { [key: string]: CoinKey } = {
	'ETH': CoinKey.ETH,
    'USDC': CoinKey.USDC,
    'USDT': CoinKey.USDT,
    'MATIC': CoinKey.MATIC,
    'BNB': CoinKey.BNB,
    'AVAX': CoinKey.AVAX,
    'DAI': CoinKey.DAI
}