import { Hop, Chain } from "@hop-protocol/sdk"
import { ethers } from "ethers"

const tokenNames = {
	1: {
		'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
		'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'WETH',
		'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
		'0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
		'': 'MATIC'
	},
	137: {
		'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'MATIC',
		'0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT',
		'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
		'0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': 'ETH'
	}
}

const useHop = () => {
	const getTransferFees = async (fromChainId, toChainId, token, amount, signer) => {
		return new Promise(async (resolve, reject) => {
			try {
				const hop = new Hop('mainnet')
				const bridge = hop.connect(signer).bridge(tokenNames[fromChainId.chainId][token.address])

				let sendData = await bridge.getSendData(amount, fromChainId, toChainId)
				const keys = Object.keys(sendData)
				
				for(let i = 0; i < keys.length; i++ ) {
					if(typeof(sendData[keys[i]]) == 'object') {
						sendData[keys[i]] = sendData[keys[i]].toString()
					}
				}

				console.log(sendData["estimatedReceived"])

				let fees = {
					gas: 0,
					amountToGet: ethers.utils.formatUnits(sendData["estimatedReceived"], token.decimal),
					transferFee: ethers.utils.formatUnits(sendData["adjustedBonderFee"], token.decimal)
				}

				console.log(fees)

				resolve(fees)

			} catch (e) {
				reject(e)
			}
		})
	}

	const bridge = async (fromChainId, toChainId, tokenAddress, amount) => {
		console.log("Bridging")
	}

	return [getTransferFees, bridge]
}

export default useHop