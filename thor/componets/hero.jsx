import { MdArrowBackIosNew } from "react-icons/md"

const Hero = () => {
    return (
        <>
            <div className=" w-full flex justify-between items-center mb-4">
                <div className="px-2 py-2 rounded-full bg-[#202040] flex items-center justify-center">
                    <MdArrowBackIosNew className="font-bold text-lg" />
                </div>
                <h1 className="font-bold text-center bg-[#202040] px-5 py-1 rounded-full ">WagPay</h1>
            </div>
        </>
    )
}

export default Hero;