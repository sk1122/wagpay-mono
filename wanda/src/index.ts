import { Chain } from "./types/chain/chain.type";
import { Coin } from "./types/coin/coin.type";
import { _getRoutes } from "./services";
import { RouteData, Routes, Token } from "./types";
import { ethers } from "ethers";
import { ApproveERC20, _checkApprove } from "./services/contract/evm/ERC20";
import { CoinKey } from "./types/coin/coin.enum";

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

	erc20ApproveNeeded = async (token: Token, spender: string, amount: string, signer: ethers.Signer): Promise<ApproveERC20> => {
		return new Promise(async (resolve, reject) => {
			try {
				const needed = await _checkApprove(token, spender, amount, signer)
				resolve(needed)
			} catch(e) {
				reject(e)
			}
		})
	}

}

// export default WagPay

(async () => {
	const wag = new WagPay()

	// wag.getRoutes({
	// 	fromChainId: 1,
	// 	toChainId: 137,
	// 	fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
	// 	toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
	// 	amount: '1000000000000000000'
	// }).then(x => console.log(x)).catch(e => console.log(e))

	const token: Token = {
		address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		chainId: 1,
		name: CoinKey.USDC,
		decimals: 6
	}

	const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx')
	let signer = ethers.Wallet.createRandom()
	signer = signer.connect(provider)

	const a = await wag.erc20ApproveNeeded(token, '0x2801a71605b5e25816235c7f3cb779f4c9dd60ee', '1000000', signer)

	console.log(a, "a")
})()