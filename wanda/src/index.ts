import { Chain } from "./types/chain/chain.type";
import { Coin } from "./types/coin/coin.type";
import { _getRoutes } from "./services";
import { ExecuteRouteData, RouteData, Routes, Token } from "./types";
import { ethers } from "ethers";
import { ApproveERC20, _checkApprove, _approve } from "./services/contract/evm/ERC20";
import { CoinKey } from "./types/coin/coin.enum";
import axios from "axios";

class WagPay {
	
	NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

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

	erc20Approve = async (token: Token, spender: string, amount: string, signer: ethers.Signer): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				await _approve(token, spender, amount, signer)
				resolve(true)
			} catch(e) {
				resolve(false)
			}
		})
	}

	executeRoute = async (route: ExecuteRouteData, signer: ethers.Signer) => {
		const address = await signer.getAddress()
		const contract = new ethers.Contract(route.contractAddress, abi, signer)

		const routeData = {
			receiver: address,
			bridge: route.contractAddress,
			toChain: Number(route.route.toChain),
			fromToken: route.route.fromToken.address,
			amount: route.route.amount,
			dexRequired: route.uniswapData ? true : false,
			dex: {
				dex: route.uniswapData.dex,
				fees: route.uniswapData.fees,
				chainId: route.uniswapData.chainId,
				fromToken: route.uniswapData.fromToken.address,
				toToken: route.uniswapData.toToken.address,
				amountToGet: route.uniswapData.amountToGet
			}
		}

		const amount = route.route.fromToken.address === this.NATIVE_ADDRESS.toLowerCase() ? route.route.amount : '0'

		await contract.transfer(routeData, { value: ethers.utils.parseEther(amount) })
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