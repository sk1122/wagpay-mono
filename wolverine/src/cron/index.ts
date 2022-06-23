import { TxStatus } from "@prisma/client"
import { prisma } from "../prisma"

const get_pending_transactions = () => {
	return prisma.transaction.findMany({
		where: {
			status: "PENDING"
		}
	})
}

const tx_update = (id: number, status: TxStatus) => {
	return prisma.transaction.update({
		where: {
			id: id
		},
		data: {
			status: status
		}
	})
}

const check_eth_tx = async (transaction_hash: string): Promise<boolean> => {
	return true
}

const check_pol_tx = async (transaction_hash: string): Promise<boolean> => {
	return true
}

const check_avax_tx = async (transaction_hash: string): Promise<boolean> => {
	return true
}

const check_bsc_tx = async (transaction_hash: string): Promise<boolean> => {
	return true
}

const cron_job_to_check_hashes = async () => {
	const functions = {
		'ETH': check_eth_tx,
		'POL': check_pol_tx,
		'AVAX': check_avax_tx,
		'BSC': check_bsc_tx
	}
	
	const pending_transactions = await get_pending_transactions()

	for(let i = 0; i < pending_transactions.length; i++) {
		const tx = pending_transactions[i]
		const f = functions[tx.from_chain]

		const tx_finality = await f(tx.origin_tx_hash)

		if(tx_finality) {
			await tx_update(tx.id, TxStatus.COMPLETED)
		} else {
			await tx_update(tx.id, TxStatus.FAILED)
		}
	}
}

cron_job_to_check_hashes()