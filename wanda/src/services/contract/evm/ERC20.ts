import { ethers } from 'ethers'
import { Token } from '@wagpay/types'

export interface ApproveERC20 {
	amount: string
	required: boolean
}

export const _checkApprove = async (token: Token, spender: string, amount: string, signer: ethers.Signer): Promise<ApproveERC20> => {
	const address = await signer.getAddress()
	
	const abi = ['function allowance(address owner, address spender) public view returns (uint256)']
	const erc20 = new ethers.Contract(token.address, abi, signer)
	
	const allowance = await erc20.allowance(address, spender)

	const allowanceNumber = Number(ethers.utils.formatUnits(allowance.toString(), token.decimals))
	const amountNumber = Number(ethers.utils.formatUnits(amount, token.decimals))

	if(allowanceNumber >= amountNumber) {
		return {
			amount: '0',
			required: false
		}
	} else {
		return {
			amount: ethers.utils.parseUnits((amountNumber - allowanceNumber).toString(), token.decimals).toString(),
			required: true
		}
	}
}

export const _approve = async (token: Token, spender: string, amount: string, signer: ethers.Signer): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const ERC20abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
		const erc20 = new ethers.Contract(token.address, ERC20abi, signer)
		try {
			await erc20.approve(spender, ethers.utils.parseUnits(amount, token.decimals))
			resolve(true)
		} catch(e) {
			reject(false)
		}
	})
}