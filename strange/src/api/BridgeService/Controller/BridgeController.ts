import express, { Request, Response } from "express"
import tokens, { chainsSupported, tokensSupported } from "@shared/tokens"
import route from "@shared/routes"
import { Token } from "@shared/types/Token"
import { ethers } from "ethers"
import fetch from "cross-fetch"
import Bridges from "src/utils/bridges"

const bridges = new Bridges()

class BridgeController {
	executeBridge = async (req: Request, res: Response) => {
		const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, receiver, amount, bridge } = req.query

		if(!fromChainId || !toChainId || !fromTokenAddress || !toTokenAddress || !receiver || !amount) {
			res.status(400).send({
				error: "Send fromChain, toChain, fromTokenAddress, toTokenAddress",
				status: 400
			})
			return
		}

		try {
			const routes = await bridges.bestBridge(fromChainId.toString(), toChainId.toString(), fromTokenAddress.toString(), toTokenAddress.toString(), amount.toString())
			const route = routes[0]

			const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/eqE3zeVND3stKdCjZdLOqU62A2jg6eJc')
			const abi = [{"inputs":[{"internalType":"address","name":"_hyphen","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"ERC20FundsTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"toChainId","type":"uint256"}],"name":"NativeFundsTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"string","name":"tag","type":"string"}],"name":"transferNative","outputs":[],"stateMutability":"payable","type":"function"}]
			const bridgeContract = new ethers.utils.Interface(abi)
			const data = bridgeContract.encodeFunctionData("transferNative", [ethers.utils.parseUnits(amount.toString(), 18), receiver.toString(), Number(toChainId.toString()), "WAGPAY"])

			res.status(200).send({
				data: data,
				route: route
			})
		} catch(e) {
			console.log(e)
			res.status(400).send(e)
		}
	}

	test = async (req: Request, res: Response) => {
		let data: any = await fetch('http://localhost:5000/api/bridge/execute-best-route?fromChainId=1&toChainId=137&fromTokenAddress=0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0&toTokenAddress=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&amount=100000000000000000000&receiver=0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46')

		data = await data.json()
		console.log(data)
		let wallet = ethers.Wallet.createRandom()
		const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/eqE3zeVND3stKdCjZdLOqU62A2jg6eJc')
		wallet = wallet.connect(provider)

		const transactionObject = {
			chainId: 137,
			value: 0,
			to: data.route.contractAddress,
			from: wallet.address,
			data: data.data
		};
		console.log(transactionObject)
		await wallet.sendTransaction(transactionObject)

		res.status(200).send(true)
	}

	bestBridge = async (req: Request, res: Response) => {
		const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount, ...data } = req.query
		
		let { bridge, dex } = data

		if(bridge) bridge = JSON.parse(bridge.toString())
		if(dex) dex = JSON.parse(dex.toString())

		console.log(bridge, dex)

		if(!fromChainId || !toChainId || !fromTokenAddress || !toTokenAddress || !amount) {
			res.status(400).send({
				error: "Send fromChain, toChain, fromTokenAddress, toTokenAddress",
				status: 400
			})
			return
		}

		try {
			var routes
			if(bridge) {
				// @ts-ignore
				routes = await bridges.bestBridge(fromChainId.toString(), toChainId.toString(), fromTokenAddress.toString(), toTokenAddress.toString(), amount.toString(), bridge)
			} else {
				routes = await bridges.bestBridge(fromChainId.toString(), toChainId.toString(), fromTokenAddress.toString(), toTokenAddress.toString(), amount.toString())
				console.log(routes)
			}
			res.status(200).send(routes)
		} catch(e) {
			console.log(e)
			res.status(400).send(e)
		}
	}
}

export default BridgeController