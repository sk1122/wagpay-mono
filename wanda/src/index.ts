import { Chain } from "./types/chain/chain.type";
import { Coin } from "./types/coin/coin.type";
import { _getRoutes } from "./services";
import { RouteData, Routes } from "./types";

class WagPay {
	
	getRoutes = async (route: RouteData): Promise<Routes[]> => {
		return new Promise(async (resolve, reject) => {
			try {
				const routes = await _getRoutes(route)
				resolve(routes)
			} catch (e) {
				reject(e)
			}
		})
	}

}

// export default WagPay

(async () => {
	const wag = new WagPay()

	wag.getRoutes({
		fromChainId: 1,
		toChainId: 137,
		fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
		amount: '1000000000000000000'
	}).then(x => console.log(x)).catch(e => console.log(e))
})()