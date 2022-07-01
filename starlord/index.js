"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = require("cross-fetch");
const client_1 = __importDefault(require("@bundlr-network/client"));
const ethers_1 = require("ethers");
const core_1 = require("@urql/core");
const utils_1 = require("ethers/lib/utils");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const bundlr = new client_1.default("https://node1.bundlr.network/", "matic", process.env.PRIV_KEY);
const query = (0, core_1.createClient)({
    url: "https://arweave.net/graphql",
});
class CrossChainID {
    constructor() {
        this.priv_keys = [
            "0x1c0ab6750b7f7efa1d1039bbbf5630e0c38620cc26f50cbcdaf39d651c38ff16",
            "0x733fba600434695cea68c8cbac27e7b09d9d88266e0636ac0fb875fe4588de88",
            "0x1b9e98b4c01f066a0cebbaeab6b9611c58d2a0cafcf5daa3fd739d6804c11f3b",
            "0xcfa3dc5c857ba621aedc7dd8cf90090214a92e7fca968de3393f168b4044dcf1",
            "0xc88ad17f1a19930a49ae6df73a4c05b05dee8ac40e45259a2aa8b21e5c83440b",
        ];
        this.addresses = [
            "0x3751EC5604576291ccD4e22D295AF1ab5D06E912",
            "0xf8Edf58F16A6F64B342f3491c4A53382F94C428d",
            "0x84591DBD1fC39e8ad6BF56183ab48E6426224410",
            "0xBc63eDCB572EdE64F784555b450f71075AAb1aFB",
            "0xcd4B181f6217eA083e3871aD0dABc1e086Deed25",
        ];
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield query
                .query((0, core_1.gql) `
					query GetTransactions($id: String!) {
						transactions(tags: [{ name: "id", values: [$id] }]) {
							edges {
								node {
									id
									tags {
										name
										value
									}
								}
							}
						}
					}
				`, {
                id: id,
            })
                .toPromise();
            let dx = [];
            for (let j = 0; j < data.data.transactions.edges.length; j++) {
                const tx = data.data.transactions.edges[j];
                // console.log(tx.node.tags);
                let found = false;
                const tags = tx.node.tags;
                if (tags) {
                    for (let i = 0; i < tags.length; i++) {
                        const tag = tags[i];
                        if (tag.name === "signatureForVerificationWagPay") {
                            const digest = (0, utils_1.arrayify)((0, utils_1.hashMessage)("wagpay did this"));
                            // const publicKey = await recoverPublicKey(digest, tags.value);
                            const address = yield (0, utils_1.recoverAddress)(digest, tag.value);
                            const foundAddress = this.addresses.find((adrs) => address === adrs);
                            if (!foundAddress)
                                continue;
                            else {
                                found = true;
                                break;
                            }
                        }
                    }
                }
                if (!found)
                    continue;
                else
                    dx.push(tx);
            }
            const id_data_req = yield (0, cross_fetch_1.fetch)(`https://arweave.net/${dx[0].node.id}`);
            const id_data = yield id_data_req.json();
            return Object.assign({ id: id }, id_data);
        });
    }
    // @note Adds a new payment id to arweave storage
    // @params id: string -> id to be claimed
    // @params address: AddressesInterface -> addresses to add to that id
    add(id, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = new ethers_1.ethers.Wallet(this.priv_keys[0]);
            const message = `wagpay did this`;
            const signature = yield wallet.signMessage(message);
            // @note - Code to Verify signature
            // const digest = arrayify(hashMessage(message));
            // const publicKey = await recoverPublicKey(digest, signature);
            // const addresss = await recoverAddress(digest, signature);
            // console.log(addresss, publicKey, await wallet.getAddress())
            const tags = [
                { name: "signatureForVerificationWagPay", value: signature },
                { name: "id", value: id },
            ];
            const tx = bundlr.createTransaction(JSON.stringify(address), { tags });
            const size = tx.size;
            const price = yield bundlr.getPrice(size);
            let response = yield bundlr.fund(price);
            if (!response)
                throw "Bundlr account can't be funded";
            yield tx.sign();
            const result = yield tx.upload();
            console.log(result);
            return result.data.id;
        });
    }
}
// id = -pGcHoae1asEa-YGYHY7iRChwd8iAj4JY2QMeXlb5I4
(() => __awaiter(void 0, void 0, void 0, function* () {
    const c = new CrossChainID();
    const id_data = yield c.get("satyam@wagpay");
    console.log(id_data);
    // c.add("shivam@wagpay", {
    // 	default: {
    // 		address: "AsS1zBSV8DeC8gf3CNMYD9QDYBegM74bAYVS9ieaLP1Y",
    // 		network: "solana",
    // 	},
    // });
}))();
