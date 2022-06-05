import { ConnectButton } from '@rainbow-me/rainbowkit';
import WagPay from '@wagpay/sdk';
// import type { Routes } from '@wagpay/sdk/dist/types';
// import { ChainId } from '@wagpay/sdk/dist/types/chain/chain.enum';
// import type { Chain } from '@wagpay/sdk/dist/types/chain/chain.type';
// import { CoinKey } from '@wagpay/sdk/dist/types/coin/coin.enum';
import type { Chain, CoinKey, Routes } from '@wagpay/types';
import { chainEnum, ChainId, coinEnum, tokens } from '@wagpay/types';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import BridgeBar from '@/components/bridgeBar';
import ChainSelect from '@/components/ChainSelect';
import CoinSelect from '@/components/CoinSelect';
import Navbar2 from '@/components/Navbar2';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Swap = () => {
  const [toggle, setToggle] = useState(false);
  const [fromChain, setFromChain] = useState(137);
  const [toChain, setToChain] = useState(1);
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('0');
  const [routes, setRoutes] = useState<Routes[]>();

  const [account, setAccount] = useState<string | undefined>('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [signer, setSigner] = useState<ethers.Signer>()

  const wagpay = new WagPay();

  const checkWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);

          // @ts-ignore
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = await provider.getSigner()

          setSigner(signer)

          console.log(accounts[0]);
        } else {
          console.log("Do not have access");
        }
      } else {
        console.log("Install Metamask");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const login = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);
          console.log("Found");
        } else {
          console.log("Not Found");
        }
      } else {
        console.log("Install Metamask");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkWalletIsConnected()
  }, [])


  const getRoutes = async (
    fromChainId: number,
    toChainId: number,
    fromToken: string,
    toToken: string,
    _amount: string
  ): Promise<void> => {
    console.log(
      fromChainId,
      toChainId,
      fromToken,
      coinEnum[toToken] as CoinKey
    );
    console.log(
      tokens,
      ChainId[fromChainId] as ChainId as number,
      ChainId.POL,
      chainEnum[fromChainId]
    );
    // @ts-ignore
    console.log(tokens[chainEnum[fromChainId]][fromCoin]);

    const availableRoutes = await wagpay.getRoutes({
      fromChain: chainEnum[fromChainId] as ChainId,
      toChain: chainEnum[toChainId] as ChainId,
      fromToken: coinEnum[fromToken] as CoinKey,
      toToken: coinEnum[toToken] as CoinKey,
      amount: _amount,
    });

    console.log(availableRoutes, 'availableRoutes');

    setRoutes(availableRoutes);
  };

  const FetcAvalabaleRoutes = () => {
    console.log(
      Number(fromChain),
      Number(toChain),
      fromCoin,
      toCoin,
      amount,
      ethers.utils
        .parseUnits(
          amount,
          // @ts-ignore
          tokens[Number(fromChain)][fromCoin.toString()]?.decimals
        )
        .toString()
    );
    if (
      fromChain &&
      Number(fromChain) &&
      toChain &&
      fromCoin &&
      toCoin &&
      amount
    ) {
      getRoutes(
        Number(fromChain),
        Number(toChain),
        fromCoin,
        toCoin,
        // @ts-ignore
        ethers.utils
          .parseUnits(
            amount,
            // @ts-ignore
            tokens[Number(fromChain)][fromCoin.toString()]?.decimals
          )
          .toString()
      );
    }
  };

  const swap = async () => {
    if(routes && routes[0] && signer) {
      await wagpay.executeRoute(routes[0], signer)
      alert('Swapping done successfully')
    }
  }

  useEffect(() => {
    console.log(fromChain, toChain);
  }, [fromChain, toChain]);

  useEffect(() => {
    FetcAvalabaleRoutes();
  }, [fromChain, toChain, fromCoin, toCoin]);

  useEffect(() => {
    const delayReaction = setTimeout(() => {
      FetcAvalabaleRoutes();
    }, 1000);

    return () => clearTimeout(delayReaction);
  }, [amount]);

  useEffect(() => {
    const interval = setInterval(getRoutes, 60000);
    return () => clearInterval(interval);
  }, []);

  // const getRoutesLocal = async (
  //   fromChainId: number,
  //   toChainId: number,
  //   fromTokenId: string,
  //   toTokenId: string,
  //   _amount: string
  // ): Promise<void> => {
  //   const availableRoutes = await wagpay.getRoutes({
  //     fromChain: ChainId[fromChainId] as ChainId,
  //     toChain: ChainId[toChainId] as ChainId,
  //     fromToken: enumDict.ETH as CoinKey,
  //     toToken: enumDict.ETH as CoinKey,
  //     amount: _amount,
  //   });
  //   setRoutes(availableRoutes);
  // };

  // if (fromChain && toChain && fromCoin && toCoin && amount) {
  //   getRoutesLocal(
  //     fromChain,
  //     toChain,
  //     fromCoin,
  //     toCoin,
  //     ethers.utils.parseUnits(amount, 6).toString()
  //   );
  // }

  const [filteredFromChains, setFilteredFromChains] = useState<Chain[]>([]);
  const [filteredToChains, setFilteredToChains] = useState<Chain[]>([]);

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id !== toChain;
    });
    setFilteredFromChains([...filteredChains]);
  }, [toChain]);

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id !== fromChain;
    });
    setFilteredToChains([...filteredChains]);
  }, [fromChain]);

  const setAmountToSwap = (e: any) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  return (
    <Main
      meta={
        <Meta
          title="WagPay"
          description="A Powerful yet simple to use swapping Dashboard"
        />
      }
    >
      <Navbar2 />

      <div className="mx-auto grid max-w-7xl grid-cols-5 py-12">
        <div
          className={
            toggle === false
              ? `col-span-5 mt-4 sm:mx-auto sm:w-full xl:col-span-2 xl:mt-12`
              : `col-span-5 mt-4 sm:mx-auto sm:w-full sm:max-w-md xl:mt-12`
          }
        >
          <div className="mx-4 rounded-lg bg-wagpay-dark py-8 px-4 shadow sm:mx-auto sm:max-w-md sm:px-6">
            {/* card starts here */}
            <div className="grid grid-cols-7 place-content-center gap-y-6 sm:grid-cols-7 sm:gap-y-0 sm:gap-x-2">
              <div className="col-span-3">
                <ChainSelect
                  label="From"
                  value={fromChain}
                  setValue={setFromChain}
                  supportedChains={filteredFromChains}
                />
              </div>
              <div className="col-span-1 mt-8 place-self-center sm:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="rounded-full bg-gray-700 p-1"
                  aria-hidden="true"
                  role="img"
                  width="32"
                  height="32"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M388.9 266.3c-5.1-5-5.2-13.3-.1-18.4L436 200H211c-7.2 0-13-5.8-13-13s5.8-13 13-13h224.9l-47.2-47.9c-5-5.1-5-13.3.1-18.4 5.1-5 13.3-5 18.4.1l69 70c1.1 1.2 2.1 2.5 2.7 4.1.7 1.6 1 3.3 1 5 0 3.4-1.3 6.6-3.7 9.1l-69 70c-5 5.2-13.2 5.3-18.3.3z"
                    fill="#ffffff"
                  ></path>
                  <path
                    d="M123.1 404.3c5.1-5 5.2-13.3.1-18.4L76.1 338H301c7.2 0 13-5.8 13-13s-5.8-13-13-13H76.1l47.2-47.9c5-5.1 5-13.3-.1-18.4-5.1-5-13.3-5-18.4.1l-69 70c-1.1 1.2-2.1 2.5-2.7 4.1-.7 1.6-1 3.3-1 5 0 3.4 1.3 6.6 3.7 9.1l69 70c5 5.2 13.2 5.3 18.3.3z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </div>
              <div className="col-span-3">
                <ChainSelect
                  label="To"
                  value={toChain}
                  setValue={setToChain}
                  supportedChains={filteredToChains}
                />
              </div>
              {/* you send section */}
              <div className="col-span-7 mt-4 sm:mt-7">
                <label
                  htmlFor="sender"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  You Send
                </label>
                <div className="flex w-full">
                  <div className="relative h-12 w-3/5 rounded-md shadow-sm">
                    <input
                      value={amount}
                      onChange={setAmountToSwap}
                      type="number"
                      placeholder="0.00"
                      className="block h-12 w-full rounded-l-md border-none bg-gray-700 px-3 text-white shadow-sm outline-none focus:border-none focus:outline-none active:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    value={fromCoin}
                    setValue={setFromCoin}
                    supportedCoins={wagpay.getSupportedCoins()}
                  />
                </div>
              </div>
              {/* You receive section */}
              <div className="col-span-7 mt-0 sm:mt-5">
                <label
                  htmlFor="receive"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  You Receive
                </label>
                <div className="flex w-full">
                  <div className="relative w-3/5 rounded-md shadow-sm">
                    <input
                      type="number"
                      placeholder="0.00"
                      disabled
                      className="block h-12 w-full rounded-l-md border-r border-none border-blue-400 bg-gray-700 px-3 text-white shadow-sm outline-none focus:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    value={toCoin}
                    setValue={setToCoin}
                    supportedCoins={wagpay.getSupportedCoins()}
                  />
                </div>
              </div>
              <div className="col-span-7 mt-1 flex items-center justify-between sm:mt-6">
                <span className="text-white">Select bridge Automatically</span>
                <div>
                  {/* Start */}
                  <div className="flex items-center">
                    <div className="mr-2 text-sm italic text-gray-400">
                      {toggle ? 'On' : 'Off'}
                    </div>
                    <div className="form-switch">
                      <input
                        type="checkbox"
                        id="switch"
                        className="sr-only"
                        checked={toggle}
                        onChange={() => setToggle(!toggle)}
                      />
                      <label className="bg-gray-400" htmlFor="switch">
                        <span
                          className="bg-white shadow-sm"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Switch label</span>
                      </label>
                    </div>
                  </div>
                  {/* End */}
                </div>
              </div>
              {/* priority section */}
              {toggle === true && (
                <div className="col-span-7 mt-1 sm:mt-3 md:mt-6">
                  <span className="text-base text-gray-200">
                    Give priority to :
                  </span>
                  <div className="mt-4 flex space-x-6">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="radio-buttons"
                          className="form-radio"
                        />
                        <span className="ml-2 text-sm text-white">
                          Gas Fees
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="radio-buttons"
                          className="form-radio"
                        />
                        <span className="ml-2 text-sm text-white">Time</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* priority end */}
              {/* connect wallet button */}
              {!isAuthenticated && 
                <button
                  onClick={() => login()}
                  type="button"
                  className="mt-5 col-span-7 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                >
                  Connect Wallet
                </button>
              }
              {isAuthenticated && 
                <button
                  onClick={() => swap()}
                  type="button"
                  className="mt-5 col-span-7 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                >
                  Swap
                </button>
              }
            </div>
          </div>
        </div>
        {toggle === false && (
          <div className="col-span-5 mt-12 mb-20 w-full sm:mx-auto sm:w-full xl:col-span-3 xl:mt-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-12 md:max-w-2xl xl:items-start">
              {/* single option */}
              {routes ? (
                routes.map((value: Routes) => {
                  return <BridgeBar key={value.name} bridge={value} />;
                })
              ) : (
                <>
                  <div className="sk-cube-grid">
                    <div className="sk-cube sk-cube1"></div>
                    <div className="sk-cube sk-cube2"></div>
                    <div className="sk-cube sk-cube3"></div>
                    <div className="sk-cube sk-cube4"></div>
                    <div className="sk-cube sk-cube5"></div>
                    <div className="sk-cube sk-cube6"></div>
                    <div className="sk-cube sk-cube7"></div>
                    <div className="sk-cube sk-cube8"></div>
                    <div className="sk-cube sk-cube9"></div>
                  </div>
                  <div className="mx-auto w-full text-center text-xl">
                    Fetching available bridges ...
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Swap;
