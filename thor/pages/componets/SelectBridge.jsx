import routes from "../../routes/routes.json";

const SelectBridge = () => {
    const toToken = "ETH";
    const fromToken = "MATIC";

    return (
        <>
            <select className="bg-slate-800 text-sm font-bold p-2 m-auto">
                {routes.available_routes[fromToken][toToken].map((route) => {
                    return route.route.map((r) => {
                        return <option key={r}>{r}</option>;
                    });
                })}
            </select>
        </>
    );
};

export default SelectBridge;
