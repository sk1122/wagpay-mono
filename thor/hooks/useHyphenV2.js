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
			return funds.transaction_hash
		} else {
			const funds = await bridgeContract.transferERC20(toChainId, fromToken.address, address, ethers.utils.parseUnits(amount, fromToken.decimals), "WAGPAY")
			console.log(funds, "ERC20")
			return funds.transaction_hash
		}
	}

	const approve = async (tokenAddress, address, signer, amount) => {
		console.log("12222")
		const userAddress = await signer.getAddress()
		
		let erc20abi = ["function approve(address _spender, uint256 _value) public returns (bool success)", "function allowance(address owner, address spender) public view virtual override returns (uint256)"]
		let erc20 = new ethers.Contract(tokenAddress, erc20abi, signer)
		
		await erc20.approve(address, ethers.utils.parseUnits(amount, 6))
	}

	const getFunds = async (ethereum, toTokenAddress, amount, address, depositHash) => {
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x1" }],
		});
		const eth_abi = [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
		const eth_contract = new ethers.Contract('0x2A5c2568b10A0E826BfA892Cf21BA7218310180b', eth_abi, signer)
		const txx = await eth_contract.sendFundsToUser(toTokenAddress, ethers.utils.parseEther(amount), address, depositHash, 0, 137)
	}

	return [bridgeFunds, getFunds]
}

export default useHyphenV2