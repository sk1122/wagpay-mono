import WalletOptionModal from "./componets/WalletOptionsModal";
import { useState } from "react";
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";



const Intro = ({ nextScreen, setNextScreen }) => {

    const connectETH = async () => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: INFURA_ID,
                    rpc: {
                        1: "https://mainnet.infura.io/v3/" + process.env.myINFURA_ID,
                        42: "https://kovan.infura.io/v3/" + process.env.myINFURA_ID,
                        137:
                            "https://polygon-mainnet.infura.io/v3/" + process.env.myINFURA_ID,
                        80001: "https://rpc-mumbai.matic.today/",
                    },
                },
                display: {
                    description: "Scan with a wallet to connect",
                },
            },
        };
        const web3modal = new Web3Modal({
            providerOptions,

        });

        try {
            const provider = await web3modal.connectTo("walletconnect");
            const ethProvider = new ethers.providers.Web3Provider(provider);
            setProvider(ethProvider);
            return provider;
        } catch (e) {
            console.log(e);
        }
    };

    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <div className="text-white  relative w-[400px] h-[600px] bg-[#1A1926] p-4  overflow-hidden">
                <div className=" w-full flex justify-end ">
                    <h1 className="font-bold text-center bg-[#202040] px-5 py-1 rounded-full ">WagPay</h1>
                </div>
                <div className="text-center">
                    <img src="/introimg.svg" alt="" />
                    <div className="mb-6 ">
                        <p className="px-12">By connecting your wallet,
                            it becomes easier for you to swap any token
                            in future</p>

                    </div>
                    <button
                        className="bg-[#4F54DA] w-full px-6 py-2 text-lg mt-6 rounded-full  "
                        onClick={(e) => {
                            e.stopPropagation();
                            setNextScreen(true)
                        }}

                    >
                        Connect wallet
                    </button>
                </div>
            </div>
            <WalletOptionModal showModal={showModal} setShowModal={setShowModal} connectETH={connectETH} />
        </>
    );
};

export default Intro;
