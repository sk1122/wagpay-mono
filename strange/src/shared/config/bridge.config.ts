import { Hop } from "@hop-protocol/sdk"
import {
	tokens,
	ChainId,
	CoinKey
} from '../../../../vision'
import { Chain } from "@hop-protocol/sdk"
import { ethers } from "ethers"

export enum BridgeId {
	Hyphen = "Hyphen",
	Hop = "Hop",
	Celer = "Celer"
}

export enum DexId {
	Uniswap = "Uniswap"
}

export interface FeesInterface {
	gasFees: string
	amountToGet: string
	transferFee: string
	bridgeTime: string
}

export interface Bridge {
	logoUri: string
	name: BridgeId
	contract: string
	supported_chains: ChainId[]
	supported_coins: CoinKey[]
	getTransferFees: (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, amount: string) => Promise<FeesInterface>
}

export interface Dex {
	logoUri: string
	name: DexId
	contract: string
	supported_chains: ChainId[]
	supported_coins: CoinKey[]
}

export const bridges: Bridge[] = [
	{
		logoUri: '',
		name: BridgeId.Hyphen,
		contract: '0xf0AdF157c4E7b92FfeAb045816560F41ff930DD2',
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [CoinKey.AVAX, CoinKey.MATIC, CoinKey.ETH, CoinKey.USDC, CoinKey.USDT, CoinKey.BNB],
		getTransferFees: async (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, amount: string): Promise<FeesInterface> => {
			let fees: FeesInterface = {
				gasFees: '',
				amountToGet: '',
				transferFee: '',
				bridgeTime: ''
			}

			const fromTokenAddress = tokens[fromChain as number][fromToken]

			const HYPHEN_BASE_URL = "https://hyphen-v2-api.biconomy.io/api/v1"
			console.log(`${HYPHEN_BASE_URL}/data/transferFee?fromChainId=${fromChain}&toChainId=${toChain}&tokenAddress=${fromTokenAddress.address}&amount=${amount}`)
			try {
				const res = await fetch(`${HYPHEN_BASE_URL}/data/transferFee?fromChainId=${fromChain}&toChainId=${toChain}&tokenAddress=${fromTokenAddress.address}&amount=${amount}`)
				if(res.status >= 400) throw "Error 404"
				const data = await res.json()
				try {
					fees = {
						gasFees: data["gasFee"],
						amountToGet: data["amountToGet"],
						transferFee: data["transferFee"],
						bridgeTime: '2'
					}
				} catch(e) {
					fees = {
						gasFees: '0',
						amountToGet: '0',
						transferFee: '0',
						bridgeTime: '2'
					}
				}
				
				return fees
			} catch (e) {
				return e
			}
		}
	},
	{
		logoUri: '',
		name: BridgeId.Hop,
		contract: '0xcC5a4A7d908CB869a890051aA7Ba12E9719F2AFb',
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [CoinKey.AVAX, CoinKey.MATIC, CoinKey.ETH, CoinKey.USDC, CoinKey.USDT, CoinKey.BNB],
		getTransferFees: async (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, amount: string): Promise<FeesInterface> => {
			let fees: FeesInterface = {
				gasFees: '',
				amountToGet: '',
				transferFee: '',
				bridgeTime: ''
			}
			
			const signer = ethers.Wallet.createRandom();
			const token = tokens[fromChain as number][fromToken];
			const hopChains: any = {
				1: Chain.Ethereum,
				137: Chain.Polygon
			};

			try {
				const hop = new Hop('mainnet')
				const bridge = hop.connect(signer).bridge(token.chainAgnositcId);

				const fromChainHop = hopChains[fromChain]
				const toChainHop = hopChains[toChain]

				let sendData: any = await bridge.getSendData(amount, fromChainHop, toChainHop)
				const keys = Object.keys(sendData)
				
				for(let i = 0; i < keys.length; i++ ) {
					if(typeof(sendData[keys[i]]) == 'object') {
						sendData[keys[i]] = sendData[keys[i]].toString()
					}
				}

				// console.log(sendData["estimatedReceived"], token)
				try {
					fees = {
						gasFees: '0',
						amountToGet: ethers.utils.formatUnits(sendData["estimatedReceived"], token.decimals),
						transferFee: ethers.utils.formatUnits(sendData["adjustedBonderFee"], token.decimals),
						bridgeTime: '10'
					}
				} catch(e) {
					fees = {
						gasFees: '0',
						amountToGet: '0',
						transferFee: '0',
						bridgeTime: '10'
					}
				}

				console.log(fees, "das")

				return fees

			} catch (e) {
				throw e
			}
		}
	},
	{
		logoUri: '',
		name: BridgeId.Celer,
		contract: '0x138C20AAc0e1602a92eCd2BF4634098b1d5765f1',
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [CoinKey.AVAX, CoinKey.MATIC, CoinKey.ETH, CoinKey.USDC, CoinKey.USDT, CoinKey.BNB],
		getTransferFees: async (fromChain: ChainId, toChain: ChainId, fromToken: CoinKey, amount: string): Promise<FeesInterface> => {
			let fees: FeesInterface = {
				gasFees: '',
				amountToGet: '',
				transferFee: '',
				bridgeTime: ''
			}

			const fromTokenAddress = tokens[fromChain as number][fromToken]

			const CELER_BASE_URL = "https://cbridge-prod2.celer.network/v2/estimateAmt"
			try {
				console.log(`${CELER_BASE_URL}?src_chain_id=${fromChain}&dst_chain_id=${toChain}&token_symbol=${fromToken}&amt=${amount}&usr_addr=0xaa47c83316edc05cf9ff7136296b026c5de7eccd&slippage_tolerance=3000`)
				const res = await fetch(`${CELER_BASE_URL}?src_chain_id=${fromChain}&dst_chain_id=${toChain}&token_symbol=${fromToken}&amt=${amount}&usr_addr=0xaa47c83316edc05cf9ff7136296b026c5de7eccd&slippage_tolerance=3000`)
				if(res.status >= 400) throw "Error 404"
				const data = await res.json()
				console.log(data)
				try {
					fees = {
						gasFees: ethers.utils.formatUnits(data["drop_gas_amt"], fromTokenAddress.decimals),
						amountToGet: ethers.utils.formatUnits(data["estimated_receive_amt"], fromTokenAddress.decimals),
						transferFee: ethers.utils.formatUnits(data['base_fee'], fromTokenAddress.decimals),
						bridgeTime: '15'
					}
				} catch (e) {
					fees = {
						gasFees: '0',
						amountToGet: '0',
						transferFee: '0',
						bridgeTime: '15'
					}
				}
				
				return fees
			} catch (e) {
				throw e
			}
		}
	},
]

export const dexes: Dex[] = [
	{
		logoUri: '',
		name: DexId.Uniswap,
		contract: '0xf9Eb876d23DEA670f984c9F2A52c8B51De67157d',
		supported_chains: [ChainId.ETH, ChainId.AVA, ChainId.BSC, ChainId.POL],
		supported_coins: [CoinKey.AVAX, CoinKey.MATIC, CoinKey.ETH, CoinKey.USDC, CoinKey.USDT, CoinKey.BNB]
	}
]