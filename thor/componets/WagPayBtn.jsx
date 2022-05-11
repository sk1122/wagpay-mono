import { AiFillThunderbolt } from "react-icons/ai";

const WagPayBtn = () => {
    return (
        <>
            <div className="w-full flex items-center justify-center bg-[#4F54DA] rounded-full">
                <button
                    className=" py-4 flex items-center"
                // onClick={() => bridge(selectedRoute, 137, 1, tokenAddress[137][JSON.parse(BaseToken).name.toUpperCase()], BaseTokenValue.toString(), tokenAddress[1][JSON.parse(ToToken).name.toUpperCase()])}
                >
                    WagPay <AiFillThunderbolt className="ml-3 text-yellow-500" />
                </button>
            </div>
        </>
    )
}

export default WagPayBtn;