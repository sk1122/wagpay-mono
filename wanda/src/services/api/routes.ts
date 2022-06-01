import axios from "axios"
import { 
	CoinKey, 
	tokens,
	RouteData,
	Routes
} from "@wagpay/types"


export const _getRoutes = async (route: RouteData): Promise<Routes[]> => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(route.fromChain, route.fromToken)
			console.log(tokens[route.fromChain as number][route.fromToken])
			let requestData = {
				fromChainId: route.fromChain,
				toChainId: route.toChain,
				fromTokenAddress: tokens[route.fromChain as number][route.fromToken].address,
				toTokenAddress: tokens[route.toChain as number][route.toToken].address,
				amount: route.amount,
				bridge: route.bridge,
				dex: route.dex,
			}

			const response = await axios.get("http://localhost:5000/api/bridge/best-route", {
				params: requestData
			})

			const routes: Routes[] = response.data
	
			resolve(routes)
		} catch(e) {
			reject(e)
		}
	})

}