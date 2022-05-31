import { ConnectButton } from '@rainbow-me/rainbowkit';
import WagPay from '@wagpay/sdk';
import type { Routes } from '@wagpay/sdk/dist/types';
import { ChainId } from '@wagpay/sdk/dist/types/chain/chain.enum';
import { CoinKey } from '@wagpay/sdk/dist/types/coin/coin.enum';
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
  const [fromChain, setFromChain] = useState('');
  const [toChain, setToChain] = useState('');
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('0');

  const [routes, setRoutes] = useState<Routes[]>();

  const wagpay = new WagPay();

  const getRoutes = async (
    fromChainId: number,
    toChainId: number,
    fromTokenAddress: string,
    toTokenAddress: string,
    _amount: string
  ): Promise<void> => {
    console.log(fromChainId, toChainId, fromTokenAddress, toTokenAddress);
    const availableRoutes = await wagpay.getRoutes({
      fromChain: ChainId.POL,
      toChain: ChainId.ETH,
      fromToken: CoinKey.USDT,
      toToken: CoinKey.USDC,
      amount: _amount,
    });

    setRoutes(availableRoutes);
  };

  useEffect(() => {
    console.log(fromChain, toChain);
  }, [fromChain, toChain]);

  useEffect(() => {
    console.log(Number(fromChain), Number(toChain), fromCoin, toCoin, amount);
    getRoutes(
      Number(fromChain),
      Number(toChain),
      fromCoin,
      toCoin,
      ethers.utils.parseUnits(amount, 6).toString()
    );
  }, [fromChain, toChain, fromCoin, toCoin, amount]);

  useEffect(() => {
    console.log(routes);
  }, [routes]);

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
                  classes="w-full rounded-md"
                  selectId="from"
                  selectName="from"
                  value={fromChain}
                  setValue={setFromChain}
                />
              </div>
              <div className="col-span-1 mt-8  place-self-center sm:block">
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
                  classes="w-full rounded-md"
                  selectId="to"
                  selectName="to"
                  value={toChain}
                  setValue={setToChain}
                />
              </div>
              {/* you send section */}
              <div className="col-span-7 mt-4 sm:mt-7">
                <label
                  htmlFor="sender"
                  className="block text-sm font-medium text-white"
                >
                  You Send
                </label>
                <div className="flex w-full">
                  <div className="relative w-3/4 rounded-md shadow-sm">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      placeholder="0.00"
                      className="mt-2 block w-full rounded-l-md border border-r-0 border-gray-200 bg-gray-700 p-2 text-white shadow-sm focus:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    classes="w-1/4 rounded-r-md"
                    selectId="send"
                    selectName="send"
                    value={fromCoin}
                    setValue={setFromCoin}
                  />
                </div>
              </div>
              {/* You receive section */}
              <div className="col-span-7 mt-0 sm:mt-5">
                <label
                  htmlFor="receive"
                  className="block text-sm font-medium text-white"
                >
                  You Receive
                </label>
                <div className="flex w-full">
                  <div className="relative w-3/4 rounded-md shadow-sm">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="mt-2 block w-full rounded-l-md border border-r-0 border-gray-200 bg-gray-700 p-2 text-white shadow-sm focus:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    classes="w-1/4 rounded-r-md"
                    selectId="receive"
                    selectName="receive"
                    value={toCoin}
                    setValue={setToCoin}
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
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  return (
                    <div
                      {...(!mounted && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                      className="col-span-7 sm:mt-6"
                    >
                      {(() => {
                        if (!mounted || !account || !chain) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="col-span-7 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="col-span-7 w-full rounded-full border border-transparent bg-red-600 py-2 px-4 text-base font-medium text-white"
                            >
                              Wrong network
                            </button>
                          );
                        }
                        return (
                          <div className="flex w-full flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 md:space-x-4 lg:space-x-6">
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="col-span-7 w-full rounded-full border border-transparent bg-white px-1 py-2 text-base text-wagpay-dark hover:bg-indigo-50"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
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
              {/* <BridgeBar
                  bridgeName="Hyphen"
                  fromToken="Polygon"
                  toToken="Eth"
                />
                <BridgeBar
                  bridgeName="Hyphen"
                  fromToken="Polygon"
                  toToken="Eth"
                /> */}
              {/* single option end */}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Swap;
