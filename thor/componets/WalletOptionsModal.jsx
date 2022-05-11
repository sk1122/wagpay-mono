import { AiOutlineClose } from "react-icons/ai";

const WalletOptionModal = ({ showModal, setShowModal, connectETH }) => {
    return (
        <>
            {showModal ? (
                <>
                    <div className="h-full  fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none bg-[#1A1926]">
                        <div className="relative my-6 mx-auto max-w-3xl lg:w-[800px]">
                            {/*content*/}
                            <div className="relative flex w-full flex-col rounded-lg  text-white bg-[#1A1926] shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between   p-5 ">
                                    <h3 className="text-3xl font-semibold">Select Wallet</h3>
                                    <button
                                        className="float-right ml-auto border-0  p-1 text-3xl font-semibold leading-none text-black  outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <AiOutlineClose className="text-white" />
                                    </button>
                                </div>
                                {/*body*/}
                                <div className=" p-8">
                                    <div className="w-full flex flex-col  justify-center items-center h-[400px]">
                                        <div
                                            className="bg-[#232233] mb-8 p-6 min-h-[150px] w-[80%] flex justify-center items-center cursor-pointer"
                                            onClick={() => {
                                                connectETH();
                                                setShowModal(false);
                                            }}
                                        >
                                            <img src="/walletConnect.png" alt="logo of wallet connect" className="object-cover" />
                                        </div>
                                        <div
                                            className=" justify-center items-center cursor-pointer p-12 flex flex-col text-center text-white bg-[#232233] h-[150px] w-[80%] "
                                            onClick={() => { }}
                                        >
                                            <img
                                                src="/metamask.png"
                                                alt="logo of wallet connect"
                                                className="w-[80px] mb-5"
                                            />
                                            <p>connect metamask</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null
            }
        </>
    );
};

export default WalletOptionModal;
