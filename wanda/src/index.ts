import { _getRoutes } from "./services";
import { ethers } from "ethers";
import { ApproveERC20, _checkApprove, _approve } from "./services/contract/evm/ERC20";
import {
	CoinKey,
	ChainId,
	Chain,
	Coin,
	ExecuteRouteData,
	RouteData,
	Routes,
	Token,
	Chains,
	ChainType
} from "@wagpay/types";

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
				reject(false)
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

				const bridgeId: any = {
					'HYPHEN': 1,
					'HOP': 2,
					'CELER': 3
				}
		
				const routeDataArr = [
					address,
					bridgeId[route.name],
					Number(route.route.toChain),
					route.route.fromToken.address,
					route.route.amount.toFixed(0),
					'0x00',
					route.uniswapData ? true : false,
					[
						route.uniswapData.dex,
						ethers.utils.parseUnits(route.route.amount.toFixed(0), route.uniswapData.fromToken.decimals),
						ethers.utils.parseUnits(route.uniswapData.fees.toFixed(0), route.uniswapData.fromToken.decimals),
						route.uniswapData.chainId,
						route.uniswapData.fromToken.address,
						route.uniswapData.toToken.address,
						'0x00'
					]
				]
				const amount = route.route.fromToken.address === this.NATIVE_ADDRESS.toLowerCase() ? route.route.amount : 0
				await contract.transfer(routeDataArr, { value: ethers.utils.parseEther(amount.toFixed(0)) })

				resolve(true)
			} catch (e) {
				reject(e)
			}
		})
	}

	getSupportedChains = () => {
		const chains: Chain[] = [
			{
				chain: Chains.ETH,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.AVAX,
					CoinKey.BNB,
					CoinKey.MATIC
				],
				logoUri: '',
				id: ChainId.ETH,
				chainName: 'ethereum'
			},
			{
				chain: Chains.POL,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.AVAX,
					CoinKey.BNB,
					CoinKey.MATIC
				],
				logoUri: '',
				id: ChainId.POL,
				chainName: 'polygon'
			},
			{
				chain: Chains.AVA,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.AVAX,
					CoinKey.BNB,
					CoinKey.MATIC
				],
				logoUri: '',
				id: ChainId.AVA,
				chainName: 'avalanche'
			},
			{
				chain: Chains.BSC,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.AVAX,
					CoinKey.BNB,
					CoinKey.MATIC
				],
				logoUri: '',
				id: ChainId.BSC,
				chainName: 'BSC'
			},
		] 

		return chains
	}

	getSupportedCoins = () => {
		const coins: Coin[] = [
			{
				logoUri: '',
				coinKey: CoinKey.USDC,
				coinName: 'USDC'
			},
			{
				logoUri: '',
				coinKey: CoinKey.USDT,
				coinName: 'USDT'
			},
			{
				logoUri: '',
				coinKey: CoinKey.ETH,
				coinName: 'ETH'
			},
			{
				logoUri: '',
				coinKey: CoinKey.AVAX,
				coinName: 'AVAX'
			},
			{
				logoUri: '',
				coinKey: CoinKey.BNB,
				coinName: 'BNB'
			},
			{
				logoUri: '',
				coinKey: CoinKey.MATIC,
				coinName: 'MATIC'
			}
		]
		
		return coins
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