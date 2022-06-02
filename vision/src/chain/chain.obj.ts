import { ChainId } from "./chain.enum";

export const chainEnum: { [key: string]: ChainId } = {
    1: ChainId.ETH,
    137: ChainId.POL,
	56: ChainId.BSC,
	43114: ChainId.AVA
};