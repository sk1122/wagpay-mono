import { InputForToken } from "."
import { useAccountContext, useDropDownContext } from "../context"
import DropDown from "./DropDown"

const SelectToken = ({ tokens }) => {
    const { baseTokenDropDownOpen, setBaseTokenOpen,
        toTokenDropDownOpen, setTokenChainOpen, } = useDropDownContext()
    const { BaseToken, setBaseToken, ToToken, setToToken, BaseTokenValue,
        setBaseTokenValue,
        ToTokenValue,
        setToTokenValue, } = useAccountContext()
    return (
        <>
            <div className="bg-[#232233] px-3 py-3 my-3">
                <h2 className="text-lg font-bold">Send</h2>
                <div className="flex justify-around items-center my-3">
                    <div className="w-[45%]">
                        <InputForToken value={BaseTokenValue} setValue={setBaseTokenValue} />
                    </div>
                    <div className="w-[45%]">
                        <DropDown DropDownItems={tokens} defaultvalue={tokens[0]} isOpen={baseTokenDropDownOpen} setIsOpen={setBaseTokenOpen} setItem={setBaseToken} chainitem={BaseToken} />
                    </div>
                </div>
                <h2 className="text-lg font-bold">You receive</h2>
                <div className="flex justify-around items-center my-3">
                    <div className="w-[45%]">
                        <div className="w-full border border-[#4D4D8D]  text-sm focus:outline-none  px-2 py-3 bg-transparent text-center">{ToTokenValue ? ToTokenValue : null}</div>
                    </div>
                    <div className="w-[45%]">
                        <DropDown DropDownItems={tokens} defaultvalue={tokens[1]} isOpen={toTokenDropDownOpen} setIsOpen={setTokenChainOpen} setItem={setToToken} chainitem={ToToken} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectToken;