import { AiFillDollarCircle } from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { BadgeButton, WalletOptionModal } from ".";
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
            <div className="text-white  relative  max-w-2xl bg-[#191926] px-4 py-6 ">
                <div className=" w-full flex justify-center  mb-9  ">
                    <h1 className="font-bold text-4xl text-center">WagPay</h1>
                </div>
                <div className="text-center w-full py-11  mb-10">
                    <h2 className="text-3xl py-5 font-bold">Connect a wallet</h2>
                    <div className="opacity-75 mb-8">
                        <p className="">By connecting your wallet,</p>
                        <p>it becomes easier for you to swap any token in fuure</p>
                    </div>
                    <div className="flex justify-center mb-9  ">
                        <BadgeButton icon={<MdPayment />} text="pay" />
                        <BadgeButton icon={<AiFillDollarCircle />} text="Transfer" />
                    </div>
                    <button
                        className="bg-black px-6 py-2 text-lg my-4  "
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(!showModal)
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