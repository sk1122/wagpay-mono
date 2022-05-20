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
require("react-toastify/dist/ReactToastify.css");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const wagmi_2 = require("wagmi");
const Claim = () => {
    const [{ data: connectData, error: connectError }, connect] = (0, wagmi_1.useConnect)();
    const [{ data: accountData }, disconnect] = (0, wagmi_1.useAccount)({
        fetchEns: true,
    });
    const [{ data, error, loading }, signMessage] = (0, wagmi_2.useSignMessage)({
        message: 'gm! \n\n Join WagPay Waitlist!',
    });
    const connectSOL = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield window.solana.connect();
            setSOL(window.solana.publicKey.toString());
        }
        catch (e) {
            console.log(e);
        }
    });
    const [username, setUsername] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [eth, setETH] = (0, react_1.useState)('');
    const [sol, setSOL] = (0, react_1.useState)('');
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [available, setAvailable] = (0, react_1.useState)('');
    const { query } = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        console.log(query);
        setUsername(query.username);
        if (query.username)
            checkUsername(query.username);
    }, [query]);
    (0, react_1.useEffect)(() => {
        if (accountData && accountData.address)
            setETH(accountData.address);
    }, [accountData]);
    (0, react_1.useEffect)(() => console.log(eth), [eth]);
    (0, react_1.useEffect)(() => console.log(sol), [sol]);
    const submit = () => __awaiter(void 0, void 0, void 0, function* () {
        yield signMessage();
        let data = {
            username: username,
            eth_address: eth,
            sol_address: sol,
            email: email,
        };
        console.log(data);
        let url = `/api/user/create`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
            react_hot_toast_1.default.success('Successfully Joined the Waitlist');
        })
            .catch((e) => {
            react_hot_toast_1.default.error('Email / Username is already registered');
        });
    });
    const checkUsername = (user) => __awaiter(void 0, void 0, void 0, function* () {
        let url = `/api/user/check_username?username=${username ? username : user}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
            if (data['is_available']) {
                react_hot_toast_1.default.success(`${username ? username : user} is Available`);
            }
            else {
                react_hot_toast_1.default.error(`${username ? username : user} is not Available`);
            }
        });
    });
    return (<div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#6C7EE1]/20 font-urban font-semibold lg:flex-row lg:justify-between lg:px-96">
      <div className="flex w-full flex-col items-center justify-center space-y-5 lg:w-1/2">
        <h1 className="text-5xl font-black">
          Next-Gen Crypto Payment Solution for Businesses
        </h1>
        <p className="text-xl font-semibold">
          Claim your WagPay Username and get a chance to win exlusive membership
          NFT
        </p>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center space-y-10 font-urban lg:w-1/2 lg:items-end">
        <div className="relative mt-10 flex h-[545px] w-[300px] flex-col items-center justify-center overflow-hidden rounded-xl bg-[#6C7EE1]/25 font-urban shadow-xl xl:w-[449px]">
          <div className="absolute -bottom-20 -right-36 h-96 w-96 select-none rounded-full bg-[#FFA8D5]/50 blur-3xl"></div>
          <div className="absolute -top-20 -left-36 h-96 w-96 select-none rounded-full bg-[#6C7EE1]/50 blur-3xl"></div>
          <div className="z-50 flex h-full w-full flex-col items-center justify-center space-y-5 p-5">
            <h1 className="text-2xl font-bold">Claim Username</h1>
            <input type="email" placeholder="satyam@gmail.com" className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <div className="flex w-full justify-between rounded-xl bg-white  opacity-80">
              <input type="text" placeholder="@satyam" className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <button className="w-1/3 rounded-xl bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] py-2 text-sm text-white" onClick={() => checkUsername()}>
                Check
              </button>
            </div>
            {eth === '' ? (<button className="border-3 flex w-full items-center justify-between rounded-xl border border-black p-3 pl-24 font-semibold" onClick={() => setIsOpen(true)}>
                <span>Connect Ethereum Wallet</span>
                <img src="/eth.png" alt="" className="items-end"/>
              </button>) : (<p className="w-20 truncate text-center lg:w-full">{eth}</p>)}
            <div className={(isOpen ? '' : 'hidden') +
            ' fixed top-1/2 left-1/2 z-50 flex h-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center space-y-5 rounded-xl bg-white text-white transition-opacity duration-1000 ease-out'}>
              <button className="absolute top-5 right-5 text-black" onClick={() => setIsOpen(false)}>
                X
              </button>
              <h2 className="text-2xl font-bold text-black">
                Connect Your Wallet
              </h2>
              <div>
                {connectData.connectors.map((connector) => (<button key={connector.id} onClick={() => __awaiter(void 0, void 0, void 0, function* () {
                yield connect(connector);
                console.log(accountData);
                setETH(accountData === null || accountData === void 0 ? void 0 : accountData.address);
            })} className="m-3 flex w-64 items-center justify-center space-x-3 rounded-xl bg-black p-3">
                    {connector.name.toLowerCase() === 'metamask' && (<img className="w-10" src="/MetaMask_Fox.svg"/>)}
                    {connector.name.toLowerCase() === 'walletconnect' && (<img className="w-10" src="/walletconnect-circle-blue.svg"/>)}
                    {connector.name.toLowerCase() === 'coinbase wallet' && (<img className="w-10" src="/coinbase.png"/>)}
                    <span>{connector.name}</span>
                    {!connector.ready && ' (unsupported)'}
                  </button>))}
              </div>
            </div>
            {sol === '' ? (<button onClick={() => __awaiter(void 0, void 0, void 0, function* () { return connectSOL(); })} className="border-3 flex w-full items-center justify-between rounded-xl border border-black p-3 pl-24 font-semibold">
                Connect Sol Wallet
                <img src="/sol.png" alt=""/>
              </button>) : (<p className="w-20 truncate text-center lg:w-full">{sol}</p>)}
            <button onClick={() => submit()} className="w-full rounded-xl bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] py-3 text-sm text-white">
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = Claim;
