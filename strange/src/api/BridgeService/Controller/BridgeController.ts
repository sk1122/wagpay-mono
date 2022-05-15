import express, { Request, Response } from "express"
import tokens, { chainsSupported, tokensSupported } from "@shared/tokens"
import route from "@shared/routes"
import { Token } from "@shared/types/Token"
import { ethers } from "ethers"
import fetch from "cross-fetch"
import Bridges from "src/utils/bridges"

const bridges = new Bridges()

class BridgeController {	
	bestBridge = async (req: Request, res: Response) => {
		const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount } = req.query

		if(!fromChainId || !toChainId || !fromTokenAddress || !toTokenAddress || !amount) {
			res.status(400).send({
				error: "Send fromChain, toChain, fromTokenAddress, toTokenAddress",
				status: 400
			})
			return
		}

		try {
			const routes = await bridges.bestBridge(fromChainId.toString(), toChainId.toString(), fromTokenAddress.toString(), toTokenAddress.toString(), amount.toString())
			res.status(200).send(routes)
		} catch(e) {
			res.status(400).send(e)
		}
	}
}

export default BridgeController