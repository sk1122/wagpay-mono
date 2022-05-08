const SelectToken = ({ token, setToken }) => {

    const tokens = [
        {
            name: "ETH",
            value: JSON.stringify({
                name: "ETH",
                chainId: 1,
                decimals: 18,
                address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            })
        },
        {
            name: "MATIC",
            value: JSON.stringify({
                name: "MATIC",
                chainId: 137,
                decimals: 18,
                address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            })
        },
        {
            name: "USDT (ETH)",
            value: JSON.stringify({
                name: "USDT",
                chainId: 1,
                decimals: 6,
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
            })
        },
        {
            name: "USDT (MATIC)",
            value: JSON.stringify({
                name: "USDT",
                chainId: 137,
                decimals: 6,
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
            })
        }
    ]


    return (
        <select

            onChange={(e) => {
                setToken(e.target.value)
            }}
            className="bg-black flex items-center px-6 py-2 text-sm focus:outline-none">
            <option value="" selected>Select Token</option>
            {tokens.map(token => {
                return <option value={token.value} key={token.name}>{token.name}</option>
            })}
        </select>
    )
}

export default SelectToken;