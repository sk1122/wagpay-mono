import DropDown from "./DropDown";
import { IoMdSwap } from "react-icons/io"
import { useDropDownContext, useAccountContext } from "../context";
import { useEffect } from "react";


const SelectChain = ({ chains }) => {
    const { baseChainDropDownOpen,
        setBaseChainOpen,
        toChainDropDownOpen,
        setToChainOpen } = useDropDownContext()

    const {
        BaseChain, setBaseChain,
        toChain, setToChain
    } = useAccountContext()
    return (
        <>
            <div className=" bg-[#232233] px-3 py-3 my-4">
                <div className="flex items-center justify-between ">
                    <div className="w-full ">
                        <h2 className="text-bold">Transfer from</h2>
                    </div>
                    <div className="w-full  pl-14">
                        <h2 className="text-bold">Transfer to</h2>
                    </div>

                </div>
                <div className="w-full flex items-center">
                    <DropDown DropDownItems={chains} defaultvalue={chains[0]} setItem={setBaseChain} chainitem={BaseChain} isOpen={baseChainDropDownOpen} setIsOpen={setBaseChainOpen} />
                    <IoMdSwap className="text-2xl font-bold w-full mx-4 my-4" />
                    <DropDown DropDownItems={chains} defaultvalue={chains[1]} setItem={setToChain} chainitem={toChain} isOpen={toChainDropDownOpen} setIsOpen={setToChainOpen} />
                </div>
            </div>

        </>
    )
}

export default SelectChain;