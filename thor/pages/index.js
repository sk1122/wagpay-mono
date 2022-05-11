
import { useState, useEffect } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { useAccountContext } from "../context";
import { ethers } from "ethers";
import useBridge from "../hooks/useBridge";
import useHyphen from "../hooks/useHyphen"
import {
  Intro,
  InputForToken,
  SelectBridge,
  SelectToken,
  BadgeButton,
  WalletOptionModal,
} from "./componets";
import useHyphenV2 from "../hooks/useHyphenV2";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum"
import Web3Modal from "web3modal"
import useBridgeV2 from "../hooks/useBridgeV2";
import useUniswap from "../hooks/useUniswap";

const chainIds = {
  'ETH': 1,
  'MATIC': 137
}

const tokenAddress = {
  1: {
    'ETH': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
    'MATIC': ''
  },
  137: {
    'ETH': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    'MATIC': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  }
}

const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad"

function WagPay() {
  const {
    BaseToken,
    setBaseToken,
    ToToken,
    setToToken,
    BaseTokenValue,
    setBaseTokenValue,
    ToTokenValue,
    setToTokenValue,
    amount
  } = useAccountContext();
  const [showModal, setShowModal] = useState(false)
  const [connectWallet, setConnectWallet] = useState("")

  const [chooseBridge, executeRoute] = useBridgeV2();
  const [getTransferFees, bridge] = useHyphen()
  const [data, setData] = useState({});
  const [signer, setSigner] = useState()

  const [swapTokens, getAmountOut] = useUniswap()
  const [bridgeFunds] = useHyphenV2()

  const connectETH = async () => {
		console.log('2')
    const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
					infuraId: INFURA_ID, // required
				}
			},
			authereum: {
				package: Authereum // required
			}
		}

		const web3modal = new Web3Modal({
      providerOptions,
		})

		try {
      
      const provider = await web3modal.connect()
      const ethProvider = new ethers.providers.Web3Provider(provider)
      
      const signer = await ethProvider.getSigner()
      console.log(signer)
      setSigner(signer)
		} catch (e) {
			console.log(e)
		}
	}
	const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

  useEffect(() => {
    // if(JSON.parse(BaseToken).address == NATIVE_ADDRESS) {
    //   setToTokenValue(BaseTokenValue - 0.001)
    // } else {
    //   setToTokenValue(BaseTokenValue - 8)
    // }

    getAmountOut(JSON.parse(BaseToken), JSON.parse(ToToken), Number(BaseTokenValue)).then(value => {
      chooseBridge(137, 1, {
        name: "USDT",
        chainId: 137,
        decimals: 6,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
      }, JSON.parse(ToToken), value.toFixed(2).toString(), signer).then(a => {
        console.log("123")
        console.log(a)
        setToTokenValue(a[0].amountToGet)
        // executeRoute(a[0], signer)
      }).catch(e => console.log(e, "123"))
    })
    

  }, [BaseTokenValue, BaseToken, ToToken])

  return (
    <div className="text-white  overflow-hidden relative w-full max-w-2xl bg-[#191926] px-4 py-6 h-[600px]" onClick={() => setShowModal(false)}>
      <div className=" w-full flex justify-center  mb-9  ">
        <h1 className="font-bold text-4xl text-center">WagPay</h1>
      </div>
      <div>
        <h2>I WANT TO SWAP</h2>
        <div className="flex justify-between bg-slate-900 my-2">
          <InputForToken value={BaseTokenValue} setValue={setBaseTokenValue} />
          <SelectToken token={BaseToken} setToken={setBaseToken} />
        </div>
        <h1>TO</h1>
        <div className="flex justify-between bg-slate-900 my-2">
          <div className="w-full text-black text-sm focus:outline-none p-1 bg-white flex items-center ">{ToTokenValue}</div>
          <SelectToken token={ToToken} setToken={setToToken} />
        </div>
      </div>

      <div className="w-full flex justify-center py-10 text-sm">
        <button
          className="bg-[#49755B] cursor-pointer px-6 py-4 flex items-center"
          onClick={() => bridgeFunds(JSON.parse(BaseToken), JSON.parse(ToToken).chainId, BaseTokenValue, signer)}
        >
          WagPay <AiFillThunderbolt className="ml-3 text-yellow-500" />
        </button>
        <button
          className="bg-[#49755B] cursor-pointer px-6 py-4 flex items-center"
          onClick={() => connectETH()}
        >
          Connect <AiFillThunderbolt className="ml-3 text-yellow-500" />
        </button>
      </div>

    </div >

  );
}

export default function Home() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [nextScreen, setNextScreen] = useState(true);

  return (
    <>

      {!nextScreen ? (
        <Intro nextScreen={nextScreen} setNextScreen={setNextScreen} />
      ) : (
        <WagPay />
      )
      }


    </>
  );
}