"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const wagmi_1 = require("wagmi");
function ConnectWallet({ walletModal, setWalletModal }) {
    var _a, _b, _c, _d, _e;
    const [{ data: connectData, error: connectError }, connect] = (0, wagmi_1.useConnect)();
    const [{ data: accountData }, disconnect] = (0, wagmi_1.useAccount)({
        fetchEns: true,
    });
    const [message, setMessage] = (0, react_1.useState)('Sign this to allow wagpay to store data offchain');
    const [{ data: signData, error: signError, loading: signLoading }, signMessage] = (0, wagmi_1.useSignMessage)();
    const signToLoadDataOffChain = () => {
        if (accountData) {
            if (!signLoading) {
                signMessage({ message }).then(d => console.log(d));
            }
        }
    };
    (0, react_1.useEffect)(() => {
        if (connectData.connected) {
            signToLoadDataOffChain();
        }
    }, [connectData.connected]);
    if (accountData) {
        return (<div>
        <img src={(_a = accountData.ens) === null || _a === void 0 ? void 0 : _a.avatar} alt="ENS Avatar"/>
          <div>
            {((_b = accountData.ens) === null || _b === void 0 ? void 0 : _b.name)
                ? `${(_c = accountData.ens) === null || _c === void 0 ? void 0 : _c.name} (${accountData.address})`
                : accountData.address}
          </div>
        <div>Connected to {(_d = accountData === null || accountData === void 0 ? void 0 : accountData.connector) === null || _d === void 0 ? void 0 : _d.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>);
    }
    const change = () => {
        console.log(walletModal);
        setWalletModal(false);
        console.log(walletModal);
    };
    (0, react_1.useEffect)(() => {
        console.log(walletModal);
    }, [walletModal]);
    return (<div className={(walletModal ? ' ' : 'hidden ') + ' flex space-x-4 absolute top-0 bottom-0'}>
      {connectData.connectors.map((connector) => (<button key={connector.id} onClick={() => connect(connector)}>
          {connector.name}
          {!connector.ready && <span>'(unsupported)'</span>}
        </button>))}
      {connectError && <div>{(_e = connectError === null || connectError === void 0 ? void 0 : connectError.message) !== null && _e !== void 0 ? _e : 'Failed to connect'}</div>}
    </div>);
}
exports.default = ConnectWallet;
