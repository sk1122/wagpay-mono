import { RouteData, Routes } from "../../types"
import axios from "axios"
import { CoinKey } from "../../types/coin/coin.enum"
import { ChainId } from "../../types/chain/chain.enum"


export const _getRoutes = async (route: RouteData): Promise<Routes[]> => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await axios.get("http://localhost:5000/api/bridge/best-route", {
				params: route
			})

			const routes: Routes[] = response.data
	
			resolve(routes)
		} catch(e) {
			reject(e)
		}
	})

}