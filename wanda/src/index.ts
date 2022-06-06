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

	executeRoute = async (route: Routes, signer: ethers.Signer): Promise<boolean | Error> => {
		return new Promise(async (resolve, reject) => {
			try {
				const address = await signer.getAddress()
				console.log(route.route.amount, "AMOUNT")
				// @note - get erc20 approval
				if(route.route.fromToken.address !== this.NATIVE_ADDRESS) {
					const needed = await this.erc20ApproveNeeded(route.route.fromToken, '0x01Dea7159eF981e7556f30Ad481FcE0A1a3D3Fb1', route.route.amount.toString(), signer)
					// console.log(needed)
					if(needed.required) {
						await this.erc20Approve(route.route.fromToken, '0x01Dea7159eF981e7556f30Ad481FcE0A1a3D3Fb1', needed.amount, signer)
					}
				}

				const hopAddresses: any = {
					1: {
						'USDC': '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
						'USDT': '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
						'ETH': '0xb8901acB165ed027E32754E0FFe830802919727f',
						'MATIC': '0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2'
					},
					137: {
						'USDC': '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
						'USDT': '0x8741Ba6225A6BF91f9D73531A98A89807857a2B3',
						'ETH': '0xc315239cFb05F1E130E7E28E603CEa4C014c57f0',
						'MATIC': '0x884d1Aa15F9957E1aEAA86a82a72e49Bc2bfCbe3'
					}
				}

				const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"newBridge","type":"address"}],"name":"addBridge","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_bridgeId","type":"uint256"}],"name":"getBridge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"bridgeId","type":"uint256"}],"name":"removeBridge","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"bridgeId","type":"uint256"},{"internalType":"uint64","name":"toChain","type":"uint64"},{"internalType":"address","name":"fromToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"extraData","type":"bytes"},{"internalType":"bool","name":"dexRequired","type":"bool"},{"components":[{"internalType":"address","name":"dex","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"fees","type":"uint256"},{"internalType":"uint64","name":"chainId","type":"uint64"},{"internalType":"address","name":"fromToken","type":"address"},{"internalType":"address","name":"toToken","type":"address"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct WagPayBridge.DexData","name":"dex","type":"tuple"}],"internalType":"struct WagPayBridge.RouteData","name":"route","type":"tuple"}],"name":"transfer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
				const contract = new ethers.Contract('0x01Dea7159eF981e7556f30Ad481FcE0A1a3D3Fb1', abi, signer)

				const bridgeId: any = {
					'Hyphen': 1,
					'Hop': 2,
					'Celer': 3
				}

				var params = '0x00';
				var dexParams = '0x00';
				const abiEncoder = ethers.utils.defaultAbiCoder;
				if(route.name === 'HYPHEN') {
					params = ''
				} else if(route.name === 'HOP') {
					params = abiEncoder.encode(
						["address bridgeAddress"],
						[route.uniswapData ? hopAddresses[route.route.fromChain][route.uniswapData.fromToken.name] : hopAddresses[route.route.fromChain][route.route.fromToken.name]]
					)
				} else if(route.name === 'CELER') {
					params = abiEncoder.encode(
						["uint64 nonce", "uint32 maxSlippage"],
						[1, 1]
					)
				}

				const routeDataArr = [
					address,
					bridgeId[route.name],
					Number(route.route.toChain),
					route.route.fromToken.address,
					route.route.amount,
					params,
					route.uniswapData ? true : false,
					[
						route.uniswapData.dex,
						route.route.amount,
						route.uniswapData.fees.toFixed(0),
						route.uniswapData.chainId,
						route.uniswapData.fromToken.address,
						route.uniswapData.toToken.address,
						dexParams
					]
				]

				console.log(routeDataArr, "routeDataArr")

				const amount = route.route.fromToken.address === this.NATIVE_ADDRESS.toLowerCase() ? route.route.amount : '0'
				const a = await contract.transfer(routeDataArr, { value: ethers.utils.parseEther(amount) })
				console.log(a)

				resolve(true)
			} catch (e) {
				console.log(e)
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
// 		fromChain: ChainId.POL,
// 		toChain: ChainId.ETH,
// 		fromToken: CoinKey.USDC,
// 		toToken: CoinKey.ETH,
// 		amount: '100000000'
// 	})
// 	// console.log(route)
// 	const token: Token = {
// 		address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
// 		chainId: 1,
// 		name: CoinKey.USDC,
// 		decimals: 6
// 	}
// 	console.log(route[0])
// 	const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d')
// 	let signer = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', provider)
// 	signer = signer.connect(provider)
	
// 	await wag.executeRoute(route[0], signer)
// })()