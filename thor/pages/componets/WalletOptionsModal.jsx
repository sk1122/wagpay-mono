import { AiOutlineClose } from "react-icons/ai";

const WalletOptionModal = ({ showModal, setShowModal, connectETH }) => {
    return (
        <>
            {showModal ? (
                <>
                    <div className="h-full fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto max-w-3xl lg:w-[800px]">
                            {/*content*/}
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between rounded-t  p-5 text-black">
                                    <h3 className="text-3xl font-semibold">Select Wallet</h3>
                                    <button
                                        className="float-right ml-auto border-0  p-1 text-3xl font-semibold leading-none text-black  outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <AiOutlineClose />
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="border flex justify-between text-black p-8">
                                    <div className="w-full flex justify-center items-center h-[400px]">
                                        <div
                                            className="border border-black p-5 w-[30%] h-[150px]  mx-4 flex justify-center items-center cursor-pointer drop-shadow-2xl"
                                            onClick={() => {
                                                connectETH();
                                                setShowModal(false);
                                            }}
                                        >
                                            <img src="/walletConnect.png" alt="logo of wallet connect" />
                                        </div>
                                        <div
                                            className="border w-[30%] h-[150px]  mx-4 flex justify-center items-center cursor-pointer flex flex-col border-black"
                                            onClick={() => { }}
                                        >
                                            <img
                                                src="/metamask.png"
                                                alt="logo of wallet connect"
                                                className="w-[30%] my-3"
                                            />
                                            <p>connect metamask</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default WalletOptionModal;
