"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../styles/globals.css");
const wagmi_1 = require("wagmi");
const injected_1 = require("wagmi/connectors/injected");
const walletConnect_1 = require("wagmi/connectors/walletConnect");
const walletLink_1 = require("wagmi/connectors/walletLink");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
const react_1 = require("react");
const react_hot_toast_1 = require("react-hot-toast");
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
const infuraId = 'a618bb907c2f4670a721be9cd51f388e';
// Chains for connectors to support
const chains = wagmi_1.defaultChains;
// Set up connectors
const connectors = ({ chainId }) => {
    var _a, _b, _c;
    const rpcUrl = (_c = (_b = (_a = chains.find((x) => x.id === chainId)) === null || _a === void 0 ? void 0 : _a.rpcUrls) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : wagmi_1.chain.mainnet.rpcUrls[0];
    return [
        new injected_1.InjectedConnector({
            chains,
            options: { shimDisconnect: true },
        }),
        new walletConnect_1.WalletConnectConnector({
            options: {
                infuraId,
                qrcode: true,
            },
        }),
        new walletLink_1.WalletLinkConnector({
            options: {
                appName: 'WagPay',
                jsonRpcUrl: `${rpcUrl}/${infuraId}`,
            },
        }),
    ];
};
function MyApp({ Component, pageProps }) {
    const network = wallet_adapter_base_1.WalletAdapterNetwork.Devnet;
    // You can also provide a custom RPC endpoint.
    const endpoint = (0, react_1.useMemo)(() => (0, web3_js_1.clusterApiUrl)(network), [network]);
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = (0, react_1.useMemo)(() => [
        new wallet_adapter_wallets_1.PhantomWalletAdapter(),
        new wallet_adapter_wallets_1.SlopeWalletAdapter(),
        new wallet_adapter_wallets_1.SolflareWalletAdapter({ network }),
        new wallet_adapter_wallets_1.TorusWalletAdapter(),
        new wallet_adapter_wallets_1.LedgerWalletAdapter(),
        new wallet_adapter_wallets_1.SolletWalletAdapter({ network }),
        new wallet_adapter_wallets_1.SolletExtensionWalletAdapter({ network }),
    ], [network]);
    return (<wagmi_1.Provider autoConnect connectors={connectors}>
      <wallet_adapter_react_1.ConnectionProvider endpoint={endpoint}>
        <wallet_adapter_react_1.WalletProvider wallets={wallets}>
          <wallet_adapter_react_ui_1.WalletModalProvider>
            <react_hot_toast_1.Toaster />
            <Component {...pageProps}/>
          </wallet_adapter_react_ui_1.WalletModalProvider>
        </wallet_adapter_react_1.WalletProvider>
      </wallet_adapter_react_1.ConnectionProvider>
    </wagmi_1.Provider>);
}
exports.default = MyApp;
