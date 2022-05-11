const TransectionDetails = () => {
    return (
        <>
            <div className="w-full my-5">
                <div className="w-full flex justify-between">
                    <p>Gass fees</p>
                    {/* <p> {selectedRoute.gas ? selectedRoute.gas.substring(0, 4) : ""}
                        {ethers.constants.EtherSymbol}</p> */}
                </div>
                <div className="w-full flex justify-between my-2">
                    <p>Slipage</p>
                    {/* <p> {selectedRoute.transferFee ? selectedRoute.transferFee.substring(0, 4) : ""}
                        {ethers.constants.EtherSymbol}</p> */}
                </div>
                <div className="w-full flex justify-between ">
                    <p>Bridge fees</p>
                    {/* <p> {selectedRoute.amountToGet ? selectedRoute.amountToGet.substring(0, 4) : ""}
                        {ethers.constants.EtherSymbol}</p> */}
                </div>
            </div>
        </>
    )
}

export default TransectionDetails;