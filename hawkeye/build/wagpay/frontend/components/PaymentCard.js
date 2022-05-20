"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("next/router");
const react_1 = require("react");
const wagmi_1 = require("wagmi");
const ethereum_qr_code_1 = __importDefault(require("ethereum-qr-code"));
const web3_js_1 = require("@solana/web3.js");
const pay_1 = require("@solana/pay");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const spl_token_1 = require("@solana/spl-token");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const web3modal_1 = __importDefault(require("web3modal"));
const web3_provider_1 = __importDefault(require("@walletconnect/web3-provider"));
const authereum_1 = __importDefault(require("authereum"));
const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';
const currencies = [
    {
        symbol: 'ETH',
        name: 'Ethereum',
        wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
    },
    {
        symbol: 'USDC (ETH)',
        name: 'USDC (Ethereum)',
        wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        wallets: ['Phantom']
    },
    {
        symbol: 'USDC (SOL)',
        name: 'USDC (Solana)',
        wallets: ['Phantom']
    }
];
const CrossIcon = () => {
    return (<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
    </svg>);
};
const PaymentCard = ({ accepted_currencies, setURL, fields, createTransaction, updateTransaction, setIsModalOpen, merchantETH, merchantSOL, setQrCode, totalPrice, }) => {
    var _a;
    const { query } = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (query && query.email) {
            console.log(query);
            setEmail(query.email);
        }
    }, []);
    const [{ data: connectData, error: connectError }, connect] = (0, wagmi_1.useConnect)();
    const [{ data: accountData }, disconnect] = (0, wagmi_1.useAccount)({
        fetchEns: true,
    });
    const connectSOL = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield window.solana.connect();
            setSOL(window.solana.publicKey.toString());
        }
        catch (e) {
            throw e;
        }
    });
    const connectETH = () => __awaiter(void 0, void 0, void 0, function* () {
        const providerOptions = {
            walletconnect: {
                package: web3_provider_1.default,
                options: {
                    infuraId: INFURA_ID, // required
                },
            },
            authereum: {
                package: authereum_1.default, // required
            },
        };
        const web3modal = new web3modal_1.default({
            providerOptions,
        });
        try {
            const provider = yield web3modal.connect();
            console.log(provider, 'PROVIDER');
            return provider;
        }
        catch (e) {
            throw e;
        }
    });
    const [username, setUsername] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [eth, setETH] = (0, react_1.useState)('');
    const [sol, setSOL] = (0, react_1.useState)('');
    const [option, setOption] = (0, react_1.useState)('ETH');
    const [wallet, setWallet] = (0, react_1.useState)('Metamask');
    const [price, setPrice] = (0, react_1.useState)(0);
    const [fieldValues, setFieldValues] = (0, react_1.useState)(fields);
    (0, react_1.useEffect)(() => {
        if (accountData && accountData.address)
            setETH(accountData.address);
    }, [accountData]);
    (0, react_1.useEffect)(() => console.log(eth), [eth]);
    (0, react_1.useEffect)(() => console.log(sol), [sol]);
    const checkIfAllFilled = () => {
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].value)
                return false;
        }
        return true;
    };
    const qrCode = () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!email || !checkIfAllFilled()) {
            react_hot_toast_1.default.error('Fill all Fields');
            return;
        }
        if (totalPrice <= 0) {
            react_hot_toast_1.default.error('Select a Product');
            return;
        }
        if (option.toLowerCase() === 'ethereum') {
            const qr = new ethereum_qr_code_1.default();
            const qrCode = yield qr.toDataUrl({
                to: merchantETH,
                value: 2,
            }, {});
            setQrCode(qrCode.dataURL);
        }
        else if (option.toLowerCase() === 'solana') {
            const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('mainnet-beta'));
            console.log('2.  a customer checkout \n');
            console.log(merchantSOL);
            const recipient = new web3_js_1.PublicKey(merchantSOL);
            console.log(price.toFixed(2));
            const amount = new bignumber_js_1.default(price.toFixed(2));
            console.log(amount);
            const reference = new web3_js_1.Keypair().publicKey;
            const label = 'Jungle Cats store';
            const message = 'Jungle Cats store - your order - #001234';
            const memo = 'JC#4098';
            const url = (0, pay_1.encodeURL)({
                recipient,
                amount,
                reference,
                label,
                message,
                memo,
            });
            // const qrCode = createQR(url);
            // console.log(qrCode)
            setURL(url);
            // setQrCode(qrCode._qr?.createDataURL())
            setIsModalOpen(true);
            console.log('\n5. Find the transaction');
            let signatureInfo;
            const { signature } = yield new Promise((resolve, reject) => {
                /**
                 * Retry until we find the transaction
                 *
                 * If a transaction with the given reference can't be found, the `findTransactionSignature`
                 * function will throw an error. There are a few reasons why this could be a false negative:
                 *
                 * - Transaction is not yet confirmed
                 * - Customer is yet to approve/complete the transaction
                 *
                 * You can implement a polling strategy to query for the transaction periodically.
                 */
                const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                    console.count('Checking for transaction...');
                    try {
                        signatureInfo = yield (0, pay_1.findTransactionSignature)(connection, reference, undefined, 'confirmed');
                        console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                        clearInterval(interval);
                        resolve(signatureInfo);
                    }
                    catch (error) {
                        if (!(error instanceof pay_1.FindTransactionSignatureError)) {
                            console.error(error);
                            clearInterval(interval);
                            reject(error);
                        }
                    }
                }), 250);
            });
            // Update payment status
            var paymentStatus = 'confirmed';
            /**
             * Validate transaction
             *
             * Once the `findTransactionSignature` function returns a signature,
             * it confirms that a transaction with reference to this order has been recorded on-chain.
             *
             * `validateTransactionSignature` allows you to validate that the transaction signature
             * found matches the transaction that you expected.
             */
            console.log('\n6. 🔗 Validate transaction \n');
            try {
                yield (0, pay_1.validateTransactionSignature)(connection, signature, recipient, amount, undefined, reference);
                // Update payment status
                paymentStatus = 'validated';
                console.log('✅ Payment validated');
                console.log('📦 Ship order to customer');
            }
            catch (error) {
                console.error('❌ Payment failed', error);
            }
        }
        else if (option.toLowerCase() === 'usdc (ethereum)') {
        }
        else if (option.toLowerCase() === 'usdc (solana)') {
            const splToken = new web3_js_1.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
            console.log('3. 💰 Create a payment request link \n');
            const recipient = new web3_js_1.PublicKey(merchantSOL);
            const amount = new bignumber_js_1.default(1);
            const reference = new web3_js_1.Keypair().publicKey;
            const label = 'Jungle Cats store';
            const message = 'Jungle Cats store - your order - #001234';
            const memo = 'JC#4098';
            const url = (0, pay_1.encodeURL)({
                recipient,
                amount,
                splToken,
                reference,
                label,
                message,
                memo,
            });
            const qrCode = (0, pay_1.createQR)(url);
            console.log(qrCode);
            setQrCode((_b = qrCode._qr) === null || _b === void 0 ? void 0 : _b.createDataURL());
        }
        setIsModalOpen(true);
    });
    const pay = () => __awaiter(void 0, void 0, void 0, function* () {
        // e.preventDefault()
        if (!email || !checkIfAllFilled()) {
            react_hot_toast_1.default.error('Fill all Fields');
            return;
        }
        if (totalPrice <= 0) {
            react_hot_toast_1.default.error('Select a Product');
            return;
        }
        if (option.toLowerCase() === 'sol') {
            var toastIdTransact;
            try {
                const toastIdConnect = react_hot_toast_1.default.loading('Connecting Solana Wallet');
                try {
                    yield connectSOL();
                }
                catch (e) {
                    react_hot_toast_1.default.dismiss(toastIdConnect);
                    react_hot_toast_1.default.error('Solana Wallet Not Connected');
                    return;
                }
                const solProvider = window.solana;
                const solConnection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('mainnet-beta'));
                react_hot_toast_1.default.dismiss(toastIdConnect);
                react_hot_toast_1.default.success('Successfully Connected Phantom');
                toastIdTransact = react_hot_toast_1.default.loading('Creating Solana Transaction');
                var transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: solProvider.publicKey,
                    toPubkey: new web3_js_1.PublicKey(merchantSOL),
                    lamports: price * web3_js_1.LAMPORTS_PER_SOL,
                }));
                transaction.feePayer = yield solProvider.publicKey;
                let blockhashObj = yield solConnection.getRecentBlockhash();
                transaction.recentBlockhash = yield blockhashObj.blockhash;
                if (transaction) {
                    console.log('Txn created successfully');
                }
                let signed = yield solProvider.signTransaction(transaction);
                var txId = yield createTransaction(email, fields, '', solProvider.publicKey);
                let signature = yield solConnection.sendRawTransaction(signed.serialize());
                yield solConnection.confirmTransaction(signature);
                yield updateTransaction(txId, true, signature);
                react_hot_toast_1.default.dismiss(toastIdTransact);
                react_hot_toast_1.default.success('Successfully Sent Transaction');
                return signature;
            }
            catch (e) {
                yield updateTransaction(txId, false, '');
                react_hot_toast_1.default.dismiss(toastIdTransact);
                react_hot_toast_1.default.error('Transaction not successful');
            }
        }
        else if (option.toLowerCase() === 'eth') {
            var toastTransact, toastConnect;
            toastConnect = react_hot_toast_1.default.loading('Connecting Ethereum Wallet');
            try {
                var pr = yield connectETH();
                console.log(pr);
            }
            catch (e) {
                react_hot_toast_1.default.dismiss(toastConnect);
                react_hot_toast_1.default.error("Can't connect to Wallet");
                return;
            }
            const ethProvider = new ethers_1.ethers.providers.Web3Provider(pr);
            const signer = ethProvider.getSigner();
            const address = yield signer.getAddress();
            setETH(address);
            react_hot_toast_1.default.dismiss(toastConnect);
            react_hot_toast_1.default.success('Successfully Connected to ' + wallet);
            toastTransact = react_hot_toast_1.default.loading('Creating Ethereum Transaction');
            try {
                const tx = yield signer.sendTransaction({
                    to: merchantETH,
                    value: ethers_1.ethers.utils.parseEther(price.toFixed(5)),
                });
                var txId = yield createTransaction(email, fields, address, '');
                console.log(tx);
                yield updateTransaction(txId, true, tx.hash);
                react_hot_toast_1.default.dismiss(toastTransact);
                react_hot_toast_1.default.success('Successfully sent Transaction');
                return tx;
            }
            catch (e) {
                let txId = yield createTransaction(email, fields, address, '');
                yield updateTransaction(txId, false, '');
                react_hot_toast_1.default.dismiss(toastTransact);
                react_hot_toast_1.default.error('Transaction not successful');
                console.log("WagPay: Can't send transaction!", e);
            }
        }
        else if (option.toLowerCase() === 'usdc (ethereum)') {
            var toastTransact, toastConnect;
            try {
                toastConnect = react_hot_toast_1.default.loading('Connecting Ethereum Wallet');
                try {
                    var pr = yield connectETH();
                    console.log(pr);
                }
                catch (e) {
                    react_hot_toast_1.default.dismiss(toastConnect);
                    react_hot_toast_1.default.error("Can't connect to Wallet");
                    return;
                }
                const ethProvider = new ethers_1.ethers.providers.Web3Provider(pr);
                const signer = ethProvider.getSigner();
                const address = yield signer.getAddress();
                setETH(address);
                react_hot_toast_1.default.dismiss(toastConnect);
                react_hot_toast_1.default.success('Successfully Connected to ' + wallet);
                toastTransact = react_hot_toast_1.default.loading('Creating Ethereum Transaction');
                let erc20abi = [
                    'function transfer(address to, uint amount) returns (bool)',
                ];
                let erc20contract = new ethers_1.ethers.Contract('0xF61Cffd6071a8DB7cD5E8DF1D3A5450D9903cF1c', erc20abi, signer);
                console.log(price.toFixed(5));
                let tx = yield erc20contract.transfer(merchantETH, ethers_1.ethers.utils.parseUnits(price.toString(), 6));
                react_hot_toast_1.default.dismiss(toastTransact);
                react_hot_toast_1.default.success('Created Transaction');
                toastTransact = react_hot_toast_1.default.loading('Waiting for Ethereum Transaction');
                yield tx.wait();
                react_hot_toast_1.default.dismiss(toastTransact);
                react_hot_toast_1.default.success('Transaction Succesful');
                var txId = yield createTransaction(email, fields, address, '');
                console.log(tx);
                yield updateTransaction(txId, true, tx.hash);
            }
            catch (e) {
                react_hot_toast_1.default.dismiss(toastTransact);
                react_hot_toast_1.default.error("Can't Transact");
                var txId = yield createTransaction(email, fields, eth, '');
                yield updateTransaction(txId, false, '');
            }
        }
        else if (option.toLowerCase() == 'usdc (solana)') {
            const toastIdConnect = react_hot_toast_1.default.loading('Connecting Solana Wallet');
            try {
                yield connectSOL();
            }
            catch (e) {
                react_hot_toast_1.default.dismiss(toastIdConnect);
                react_hot_toast_1.default.error('Solana Wallet Not Connected');
                return;
            }
            const solProvider = window.solana;
            const solConnection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'));
            react_hot_toast_1.default.dismiss(toastIdConnect);
            react_hot_toast_1.default.success('Successfully Connected Phantom');
            toastIdTransact = react_hot_toast_1.default.loading('Creating Solana Transaction');
            const tokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), solProvider.publicKey);
            const tokenAccountInfo = yield (0, spl_token_1.getAccount)(solConnection, tokenAccount);
            console.log(merchantSOL);
            const merchantTokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), new web3_js_1.PublicKey(merchantSOL));
            const merchantTokenAccountInfo = yield (0, spl_token_1.getAccount)(solConnection, merchantTokenAccount);
            console.log(tokenAccountInfo);
            const instructions = (0, spl_token_1.createTransferInstruction)(tokenAccountInfo.address, merchantTokenAccountInfo.address, solProvider.publicKey, 1, [], spl_token_1.TOKEN_PROGRAM_ID);
            const transaction = new web3_js_1.Transaction().add(instructions);
            transaction.feePayer = solProvider.publicKey;
            transaction.recentBlockhash = (yield solConnection.getRecentBlockhash()).blockhash;
            let signed = yield solProvider.signTransaction(transaction);
            const transactionSignature = yield solConnection.sendRawTransaction(signed.serialize());
            yield solConnection.confirmTransaction(transactionSignature);
            react_hot_toast_1.default.dismiss(toastIdTransact);
        }
    });
    (0, react_1.useEffect)(() => {
        if (option.toLowerCase() == 'eth') {
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
                .then((data) => data.json())
                .then((res) => setPrice(totalPrice / Number(res.ethereum.usd)));
        }
        else if (option.toLowerCase() == 'sol') {
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
                .then((data) => data.json())
                .then((res) => setPrice(totalPrice / Number(res.solana.usd)));
        }
        else {
            setPrice(totalPrice);
        }
    }, [totalPrice, option]);
    const changeField = (idx, value) => {
        setFieldValues((previousState) => {
            let values = [...fieldValues];
            values[idx].value = value;
            return values;
        });
    };
    (0, react_1.useEffect)(() => {
        console.log(fieldValues, 'fieldValues');
    }, [fieldValues]);
    const [agreed, setAgreed] = (0, react_1.useState)(false);
    return (
    // <div className="flex h-full w-full flex-col items-center justify-center space-y-10 font-urban lg:w-1/2 lg:items-end">
    //   <div className="relative mt-10 flex h-[545px] w-[300px] flex-col items-center justify-center overflow-hidden rounded-xl font-urban shadow-xl xl:w-[449px]">
    //     <div className="absolute -top-20 -left-36 -z-50 h-96 w-96 select-none rounded-full bg-[#FFA8D5]/50 blur-3xl"></div>
    //     <div className="absolute -bottom-20 -right-36 -z-50 h-96 w-96 select-none rounded-full bg-[#6C7EE1]/50 blur-3xl"></div>
    //     <div className="flex h-full w-full flex-col items-center justify-center space-y-5 p-5">
    //       <h1 className="text-2xl font-bold">WagPay</h1>
    //       <div className="flex w-full justify-between rounded-xl bg-white  opacity-80">
    //         <input
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           type="email"
    //           placeholder="Email"
    //           className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none"
    //           required
    //         />
    //       </div>
    //       {fields.map((value, idx) => (
    //         <div className="flex w-full justify-between rounded-xl bg-white  opacity-80">
    //           <input
    //             value={fieldValues[idx].value}
    //             onChange={(e) => changeField(idx, e.target.value)}
    //             type={value.type}
    //             placeholder={value.name}
    //             className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none"
    //             required
    //           />
    //         </div>
    //       ))}
    //   <div className="flex w-full justify-between">
    //     <select
    //       className="form-select block
    // 				w-1/3
    // 				appearance-none
    // 				rounded-xl
    // 				border
    // 				border-solid
    // 				border-gray-300
    // 				bg-white
    // 				bg-clip-padding bg-no-repeat px-3
    // 				py-1.5 text-base font-normal
    // 				text-gray-700
    // 				transition
    // 				ease-in-out
    // 				focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
    //       aria-label="Default select example"
    //       onChange={(e) =>
    //         setOption(e.target.value as supported_currencies)
    //       }
    //     >
    //       {Object.keys(currencies[0]).map((currency) => {
    //         return <option value={currency}>{currency}</option>
    //       })}
    //     </select>
    //     <select
    //       className="form-select block
    // 				w-1/3
    // 				appearance-none
    // 				rounded-xl
    // 				border
    // 				border-solid
    // 				border-gray-300
    // 				bg-white
    // 				bg-clip-padding bg-no-repeat px-3
    // 				py-1.5 text-base font-normal
    // 				text-gray-700
    // 				transition
    // 				ease-in-out
    // 				focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
    //       aria-label="Default select example"
    //       onChange={(e) =>
    //         setWallet(e.target.value as supported_currencies)
    //       }
    //     >
    //       {currencies[0][option as supported_currencies].wallets.map(
    //         (value) => {
    //           return <option value={value}>{value}</option>
    //         }
    //       )}
    //     </select>
    //   </div>
    //       <div className="flex w-full items-center justify-between">
    //         <div className="flex items-center justify-center space-x-2">
    //           <p>${totalPrice}</p>
    //           <p>
    //             ~{price.toFixed(2)}{' '}
    //             {option.toLowerCase() === 'ethereum'
    //               ? 'ETH'
    //               : option.toLowerCase() === 'solana'
    //               ? 'SOL'
    //               : 'USDC'}
    //           </p>
    //         </div>
    //         {option.toLowerCase() === 'solana' && (
    //           <div
    //             onClick={() => qrCode()}
    //             className="h-10 w-10 cursor-pointer rounded-xl"
    //           >
    //             <img
    //               src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
    //               alt=""
    //               className="h-full w-full"
    //             />
    //           </div>
    //         )}
    //         {/* <div ref={ref}></div> */}
    //       </div>
    //       <button
    //         onClick={pay}
    //         className="w-full rounded-xl bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] py-3 text-sm text-white"
    //       >
    //         Pay
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="h-full w-full overflow-hidden rounded-xl bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 lg:py-14">
        <div className="relative min-w-full">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              WagPay
            </h2>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                </div>
              </div>
              <div className="sm:col-span-2">
                {fields.map((value, idx) => (<>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {value.name}
                    </label>

                    <input value={fieldValues[idx].value} onChange={(e) => changeField(idx, e.target.value)} type={value.type} className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required/>
                  </>))}
              </div>

              {/* ------------------------------- */}
              <div className="mt-1 -space-y-px rounded-md shadow-sm">
                <select className="relative block w-full rounded-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" aria-label="Default select example" onChange={(e) => setOption(e.target.value)}>
                  {currencies.map(currency => {
            if (!accepted_currencies.includes(currency.symbol))
                return <div></div>;
            return <option value={currency.symbol}>{currency.name}</option>;
        })}
                </select>
              </div>
              <div className="mt-1 -space-y-px rounded-md shadow-sm">
                <select className="relative block w-full rounded-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" aria-label="Default select example" onChange={(e) => setWallet(e.target.value)}>
                  {(_a = currencies.find(currency => currency.symbol === option)) === null || _a === void 0 ? void 0 : _a.wallets.map(value => {
            return <option value={value}>{value}</option>;
        })}
                </select>
              </div>
              {/* ------------------------------- */}

              <div className="flex w-full items-center justify-between">
                {' '}
                <div className="flex items-center justify-center space-x-2">
                  <p>${totalPrice}</p>{' '}
                  <p>
                    ~{price.toFixed(2)}{' '}
                    {option.toLowerCase() === 'eth'
            ? 'ETH'
            : option.toLowerCase() === 'sol'
                ? 'SOL'
                : 'USDC'}
                  </p>
                </div>
                {option.toLowerCase() === 'sol' && (<div onClick={() => qrCode()} className="h-10 w-10 cursor-pointer rounded-xl">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="" className="h-full w-full"/>
                  </div>)}
                {/* <div ref={ref}></div> */}
              </div>
              {/* ------------------------------- */}

              <div className="sm:col-span-2">
                <button onClick={pay} className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};
exports.default = PaymentCard;
