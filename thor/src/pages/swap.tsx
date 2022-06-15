import WagPay from '../../../wanda';
// import type { Routes } from '@wagpay/sdk/dist/types';
// import { ChainId } from '@wagpay/sdk/dist/types/chain/chain.enum';
// import type { Chain } from '@wagpay/sdk/dist/types/chain/chain.type';
// import { CoinKey } from '@wagpay/sdk/dist/types/coin/coin.enum';
import type { Chain, CoinKey, Routes } from '@wagpay/types';
import { chainEnum, ChainId, coinEnum, tokens } from '@wagpay/types';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import { useSigner } from 'wagmi';
import toast from 'react-hot-toast';

import BridgeBar from '@/components/bridgeBar';
import ChainSelect from '@/components/ChainSelect';
import CoinSelect from '@/components/CoinSelect';
import Navbar2 from '@/components/Navbar2';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import Modal from '@/components/Modal';
import { db } from '@/utils/db';

const Swap = () => {
  const wagpay = new WagPay();

  const [toggle, setToggle] = useState(false);
  const [fromChain, setFromChain] = useState<Chain>(wagpay.getSupportedChains()[0]);
  const [toChain, setToChain] = useState<Chain>(wagpay.getSupportedChains()[1]);
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('0');
  const [routes, setRoutes] = useState<Routes[]>();
  const [routeToExecute, setRouteToExecute] = useState<Routes>();

  // @ts-ignore
  const [account, setAccount] = useState<string | undefined>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // @ts-ignore
  const [signer, setSigner] = useState<ethers.Signer>();
  const [isDropDownOpenp, setIsDropDownOpenp] = useState(false);
  const priorties = ['Hight returns', 'Low Gas fees', 'Less time'];
  const [priorityValue, setPRiorityValue] = useState(priorties[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [access, setAccess] = useState(false);

  // @ts-ignore
  const { data: signerData, isError, isLoading } = useSigner();

  useEffect(() => {
    if (signerData) {
      signerData.getAddress().then((address) => {
        setAccount(address);
        db(address)
          .then((find) => {
            if (find) {
              setAccess(true);
              toast.success('You are whitelisted');
            } else {
              setAccess(false);
              toast.error('You are not whitelisted');
            }
          })
          // @ts-ignore
          .catch((e) => {
            setAccess(false);
            toast.error('You are not whitelisted');
          });
      });
      setIsModalOpen(true);
    }
  }, [signerData]);

  const checkWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);

          // @ts-ignore
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();

          setSigner(signer);

          console.log(accounts[0]);
        } else {
          console.log('Do not have access');
        }
      } else {
        console.log('Install Metamask');
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
          method: 'eth_requestAccounts',
        });

        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);
          console.log('Found');
        } else {
          console.log('Not Found');
        }
      } else {
        console.log('Install Metamask');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  useEffect(() => console.log(Object.values(wagpay.getSupportedCoins(toChain.id))))

  const getRoutes = async (
    fromChainId: number,
    toChainId: number,
    fromToken: string,
    toToken: string,
    _amount: string
  ): Promise<void> => {
    if (!access) {
      toast.error("You don't have access ser!");
      return;
    }
    var availableRoutes;

    const toastId = toast.loading('Fetching Routes');

    try {
      availableRoutes = await wagpay.getRoutes({
        fromChain: chainEnum[fromChainId] as ChainId,
        toChain: chainEnum[toChainId] as ChainId,
        fromToken: coinEnum[fromToken] as CoinKey,
        toToken: coinEnum[toToken] as CoinKey,
        amount: _amount,
      });
    } catch (e) {
      toast.error("Can't Fetch Routes Between these chains", {
        id: toastId,
      });
      return;
    }

    toast.success('Fetched routes successfully', {
      id: toastId,
    });

    setRoutes(availableRoutes);
  };

  const FetcAvalabaleRoutes = () => {
    console.log(
      Number(fromChain.id),
      Number(toChain.id),
      fromCoin,
      toCoin,
      amount,
      ethers.utils
        .parseUnits(
          amount,
          // @ts-ignore
          tokens[Number(fromChain.id)][fromCoin.toString()]?.decimals
        )
        .toString()
    );
    if (
      fromChain &&
      Number(fromChain.id) &&
      toChain &&
      fromCoin &&
      toCoin &&
      amount
    ) {
      getRoutes(
        Number(fromChain.id),
        Number(toChain.id),
        fromCoin,
        toCoin,
        // @ts-ignore
        ethers.utils
          .parseUnits(
            amount,
            // @ts-ignore
            tokens[Number(fromChain.id)][fromCoin.toString()]?.decimals
          )
          .toString()
      );
    }
  };

  const swap = async () => {
    if (!access) {
      toast.error("You don't have access ser!");
      return;
    }

    setSwapping(true);
    if (routeToExecute && routes && routes[0] && signerData) {
      const id = toast.loading('Swapping...');
      try {
        await wagpay.executeRoute(routeToExecute, signerData);
      } catch (e) {
        toast.error('some error', {
          id: id,
        });
        setSwapping(false);
        return;
      }
      toast.success('Successfully swapped', {
        id: id,
      });
    }
    setSwapping(false);
  };

  useEffect(() => {
    if (routes) setRouteToExecute(routes[0]);
  }, [routes]);

  useEffect(() => {
    FetcAvalabaleRoutes();
  }, [fromChain, toChain, fromCoin, toCoin]);

  const [filteredFromChains, setFilteredFromChains] = useState<Chain[]>([]);
  const [filteredToChains, setFilteredToChains] = useState<Chain[]>([]);

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id !== toChain.id;
    });
    setFilteredFromChains([...filteredChains]);
  }, [toChain]);

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id !== fromChain.id;
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

      <div
        className="mx-auto grid max-w-7xl grid-cols-5 py-12"
        onClick={() => {
          setIsDropDownOpenp(false);
        }}
      >
        <div
          className={
            toggle === false
              ? `col-span-5 mt-4 sm:mx-auto sm:w-full xl:col-span-2 xl:mt-12`
              : `col-span-5 mt-4 sm:mx-auto sm:w-full sm:max-w-md xl:mt-12`
          }
        >
          <div className="mx-4 rounded-lg bg-[#010409] py-8 px-4 shadow sm:mx-auto sm:max-w-md sm:px-6">
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
              <div
                className="col-span-1 mt-8 cursor-pointer place-self-center sm:block"
                onClick={() => {
                  setFromChain(toChain);
                  setToChain(fromChain);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="rounded-full bg-[#161B22] p-1"
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
                      className="block h-12 w-full rounded-l-md border-none bg-[#161B22] px-3 text-white shadow-sm outline-none focus:border-none focus:outline-none active:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    value={fromCoin}
                    setValue={setFromCoin}
                    supportedCoins={Object.values(
                      wagpay.getSupportedCoins(fromChain.id)
                    )}
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
                      value={
                        routeToExecute
                          ? Number(routeToExecute.amountToGet).toFixed(2)
                          : 0.0
                      }
                      className="block h-12 w-full rounded-l-md border-r border-none border-blue-400 bg-[#161B22] px-3 text-white shadow-sm outline-none focus:outline-none sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-3">
                      <span className="text-xs text-gray-300">MAX</span>
                    </div>
                  </div>
                  <CoinSelect
                    value={toCoin}
                    setValue={setToCoin}
                    supportedCoins={Object.values(
                      wagpay.getSupportedCoins(toChain.id)
                    )}
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
              {!isAuthenticated && (
                <button
                  onClick={() => login()}
                  type="button"
                  className="col-span-7 mt-5 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                >
                  Connect Wallet
                </button>
              )}
              {isAuthenticated && (
                <>
                  {swapping && (
                    <button
                      onClick={() => swap()}
                      type="button"
                      className="flex justify-center items-center col-span-7 mt-5 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                    >
                      <div className="bg-white text-sm cursor-pointer text-black px-3 py-3 rounded-md font-semibold w-40 flex justify-center items-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#000"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="#000"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  )}
                  {!swapping && (
                    <button
                      onClick={() => swap()}
                      type="button"
                      className="col-span-7 mt-5 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
                    >
                      Swap
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-5 mt-12 mb-20 w-full sm:mx-auto sm:w-full xl:col-span-3 xl:mt-12">
          <div className="mb-12 flex w-full items-center justify-between  bg-[#010409] p-4 ">
            <div className="rounded-full bg-[#161B22] p-1">
              <FiRefreshCw className="text-3xl" />
            </div>
            <div className="rounded-lg bg-[#161B22] p-2">
              <button
                className=" group relative flex w-full items-center justify-center text-white shadow focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropDownOpenp(!isDropDownOpenp);
                }}
              >
                <div className=" flex w-full items-center justify-center">
                  {priorityValue ? (
                    <p className="" data-value={priorityValue}>
                      {priorityValue}
                    </p>
                  ) : null}
                  <MdArrowDropDown className="text-2xl font-bold" />
                </div>
                {isDropDownOpenp ? (
                  <div className=" absolute top-full z-50 mt-4 w-max min-w-full rounded bg-[#161B22]">
                    <ul className="rounded  text-left">
                      {priorties.map((item) => {
                        return (
                          <li
                            // @ts-ignore
                            onClick={(e) => {
                              setPRiorityValue(item);
                            }}
                            className="px-4  py-1 hover:bg-gray-700 "
                            key={item}
                          >
                            <span className="">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </button>
            </div>
          </div>
          {toggle === false && (
            <div className="mx-auto flex w-full flex-col justify-center space-y-12 md:max-w-2xl xl:items-start">
              {/* single option */}
              {routes ? (
                routes.map((value: Routes) => {
                  return (
                    <div
                      className="cursor-pointer"
                      key={value.name}
                      onClick={() => {
                        setRouteToExecute(value);
                      }}
                    >
                      <BridgeBar bridge={value} />;
                    </div>
                  );
                })
              ) : (
                <>
                  {swapping && (
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
                </>
              )}
            </div>
          )}
        </div>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <div className="w-full h-full flex justify-center flex-col items-center text-black font-inter">
            <div
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer absolute top-5 right-5"
            >
              X
            </div>
            {!access && (
              <>
                <h1 className="text-2xl">
                  Checking if you are in the whitelist
                </h1>
                <div className="mb-5">
                  <div className="bg-white text-sm cursor-pointer text-black px-3 py-3 rounded-md font-semibold w-40 flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#000"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#000"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </>
            )}
            {access && (
              <h1 className="text-2xl">You have access to WagPay ser!</h1>
            )}
            <div>
              If not please fill this{' '}
              <a className="text-blue-500 font-bold" href="">
                form
              </a>
            </div>
          </div>
        </Modal>
      </div>
    </Main>
  );
};

export default Swap;
