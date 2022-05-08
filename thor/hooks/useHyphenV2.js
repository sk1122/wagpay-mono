import { useState } from 'react'
import { ethers } from "ethers"

const abi = [{"inputs":[{"internalType":"address","name":"_hyphen","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"ERC20FundsTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"}],"name":"NativeFundsTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferNative","outputs":[],"stateMutability":"payable","type":"function"}]

const useHyphenV2 = () => {
	const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

	const bridgeFunds = async (fromToken, toChainId, amount, signer) => {
		const bridge = '0x2C0F951287332AB8c342AD4254F0C0246ef19ec5'
		const address = await signer.getAddress()

		const bridgeContract = new ethers.Contract(bridge, abi, signer)

		if(fromToken.address == NATIVE_ADDRESS) {
			const funds = await bridgeContract.transferNative(ethers.utils.parseUnits(amount, fromToken.decimals), address, toChainId, "WAGPAY", { value: ethers.utils.parseUnits(amount, fromToken.decimals) })
			console.log(funds, "NATIVE")
		} else {
			const funds = await bridgeContract.transferERC20(toChainId, fromToken.address, address, ethers.utils.parseUnits(amount, fromToken.decimals), "WAGPAY")
			console.log(funds, "ERC20")
		}
	}

	return [bridgeFunds]
}

export default useHyphenV2