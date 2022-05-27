import { _getRoutes } from "./services";
import { ExecuteRouteData, RouteData, Routes, Token } from "./types";
import { ethers } from "ethers";
import { ApproveERC20, _checkApprove, _approve } from "./services/contract/evm/ERC20";
import { ChainId } from "./types/chain/chain.enum";
import { CoinKey } from "./types/coin/coin.enum";

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

	executeRoute = async (route: ExecuteRouteData, signer: ethers.Signer): Promise<boolean | Error> => {
		return new Promise(async (resolve, reject) => {
			try {
				const address = await signer.getAddress()
				
				// @note - get erc20 approval
				if(route.route.fromToken.address !== this.NATIVE_ADDRESS) {
					const needed = await this.erc20ApproveNeeded(route.route.fromToken, address, route.route.amount.toString(), signer)

					if(needed) {
						await this.erc20Approve(route.route.fromToken, address, route.route.amount.toString(), signer)
					}
				}

				const abi = [{"inputs":[{"components":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"bridge","type":"address"},{"internalType":"uint256","name":"toChain","type":"uint256"},{"internalType":"address","name":"fromToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"dexRequired","type":"bool"},{"components":[{"internalType":"address","name":"dex","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"fromToken","type":"address"},{"internalType":"address","name":"toToken","type":"address"}],"internalType":"struct WagpayBridge.DexData","name":"dex","type":"tuple"}],"internalType":"struct WagpayBridge.RouteData","name":"_route","type":"tuple"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"}]
				const contract = new ethers.Contract('0xc39863a88857fffc88695f2426Dd2157685e8F16', abi, signer)
		
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
		
				const routeDataArr = [
					address,
					route.contractAddress,
					Number(route.route.toChain),
					route.route.fromToken.address,
					route.route.amount.toFixed(0),
					route.uniswapData ? true : false,
					[
						route.uniswapData.dex,
						ethers.utils.parseUnits(route.route.amount.toFixed(0), route.uniswapData.fromToken.decimals),
						ethers.utils.parseUnits(route.uniswapData.fees.toFixed(0), route.uniswapData.fromToken.decimals),
						route.uniswapData.chainId,
						route.uniswapData.fromToken.address,
						route.uniswapData.toToken.address
					]
				]
				const amount = route.route.fromToken.address === this.NATIVE_ADDRESS.toLowerCase() ? route.route.amount : 0
				console.log(routeDataArr, amount.toFixed(0))
		
				await contract.transfer(routeDataArr, { value: ethers.utils.parseEther(amount.toFixed(0)) })

				resolve(true)
			} catch (e) {
				reject(e)
			}
		})
	}

}

export default WagPay

// (async () => {
// 	const wag = new WagPay()

// 	const route = await wag.getRoutes({
// 		fromChain: ChainId.ETH,
// 		toChain: ChainId.POL,
// 		fromToken: CoinKey.ETH,
// 		toToken: CoinKey.MATIC,
// 		amount: '1000000000000000000'
// 	})
// 	console.log(route)
// 	const token: Token = {
// 		address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
// 		chainId: 1,
// 		name: CoinKey.USDC,
// 		decimals: 6
// 	}
// 	console.log(route)
// 	// const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx')
// 	// let signer = ethers.Wallet.createRandom()
// 	// signer = signer.connect(provider)
	
// 	// wag.executeRoute(route[0], signer)
// })()