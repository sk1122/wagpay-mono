export enum ChainNameEnum {
	POL = "POL",
	ETH = "ETH",
	AVAX = "AVAX",
	BSC = "BSC",
}

export enum BridgeNameEnum {
	HOP = "HOP",
	CELER = "CELER",
	HYPHEN = "HYPHEN",
	ACROSS = "ACROSS",
}

export enum TxStatus {
	PENDING = "PENDING",
	FAILED = "FAILED",
	COMPLETED = "COMPLETED",
}

export interface Tx {
	id?: number;
	from: string;
	to: string;
	from_chain: ChainNameEnum;
	to_chain: ChainNameEnum;
	origin_tx_hash: string;
	dest_tx_hash?: string;
	bridge: BridgeNameEnum;
	status: TxStatus;
	origin_time: Date;
	dest_time?: Date;
}
