import { useAppContext } from '@/context';
import ChainSelect from './ChainSelect';
import CoinSelect from './CoinSelect';
import SwapChainButton from './swapChainButton';
import WagPay from '@wagpay/sdk';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import BottomCard from './BottomCard';

interface Props {
  signerData: any;
}

const SwapCard = ({ signerData }: Props) => {
  const wagpay = new WagPay();
  const {
    toChain,
    setToChain,
    setFromChain,
    fromChain,
    access,
    routeToExecute,
    fromCoin,
    toCoin,
    setFromCoin,
    setToCoin,
    isAuthenticated,
    toggle,
    setToggle,
    swapping,
    setSwapping,
    amount,
    routes,
    filteredFromChains,
    filteredToChains,
    setAmount,
    setAccount,
    setIsAuthenticated,
    isDropDownOpenFromCoin,
    setIsDropDownOpenFromCoin,
    isDropDownOpenToCoin,
    setIsDropDownOpenToCoin,
  } = useAppContext();

  const setAmountToSwap = (e: any) => {
    e.preventDefault();
    setAmount(e.target.value);
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

  const swap = async () => {
    console.log('hiiii');
    if (!access) {
      toast.error("You don't have access ser!");
      console.log('hii');
      return;
    }

    setSwapping(true);
    if (routeToExecute && routes && routes[0] && signerData) {
      const id = toast.loading('Swapping...');
      try {
        console.log(signerData);
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
    console.log(fromCoin, toCoin, wagpay.getSupportedCoins(137), 'fromCoin');
  }, [fromCoin, toCoin]);

  return (
    <>
      <div className="grid grid-cols-7 place-content-center gap-y-6 sm:grid-cols-7 sm:gap-y-0 sm:gap-x-2">
        <div className="col-span-7 bg-[#191919] p-6">
          <h1 className='mb-4 text-lg'>selected chains</h1>
          <div className='w-full flex space-x-2'>
            <div className="w-full ">
              <ChainSelect
                label="source chain"
                value={fromChain}
                setValue={setFromChain}
                supportedChains={filteredFromChains}
              />
            </div>
            <SwapChainButton />
            <div className="w-full">
              <ChainSelect
                label="Destination chain"
                value={toChain}
                setValue={setToChain}
                supportedChains={filteredToChains}
              />
            </div>
          </div>
        </div>

        {/* you send section */}
        <div className='col-span-7 px-5 py-6 bg-wagpay-card-bg my-4'>
          <h1 className='mb-4 text-lg'>Selected coins</h1>
        <div className="col-span-7 ">
          <label
            htmlFor="sender"
            className="mb-2 block text-sm font-medium text-white"
          >
            You Sent
          </label>
          <div className="flex w-full">
            <div className="relative h-12 w-3/5 rounded-md shadow-sm">
              <input
                value={amount}
                onChange={setAmountToSwap}
                type="number"
                placeholder="0.00"
                className="block h-12 w-full rounded-l-md border-none bg-[#464646] px-3 text-white shadow-sm outline-none focus:border-none focus:outline-none active:outline-none sm:text-sm"
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
              isDropDownOpenCoin={isDropDownOpenFromCoin}
              setIsDropDownOpenCoin={setIsDropDownOpenFromCoin}
            />
          </div>
          <p className='text-sm text-opacity-70 text-white mt-2'>100 used</p>
        </div>
       
        {/* You receive section */}
        <div className="col-span-7 mt-0 sm:mt-5">
          <label
            htmlFor="receive"
            className="mb-2 block text-sm font-medium text-white"
          >
            You Received (estimated)
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
                className="block h-12 w-full rounded-l-md border-r border-none border-blue-400 bg-[#464646] px-3 text-white shadow-sm outline-none focus:outline-none sm:text-sm"
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
              isDropDownOpenCoin={isDropDownOpenToCoin}
              setIsDropDownOpenCoin={setIsDropDownOpenToCoin}
            />
            
          </div>
          <p className='text-sm text-opacity-70 text-white mt-2'>100 used</p>
        </div>
        </div>
        <BottomCard />
       
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
            <span className="text-base text-gray-200">Give priority to :</span>
            <div className="mt-4 flex space-x-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="radio-buttons"
                    className="form-radio"
                  />
                  <span className="ml-2 text-sm text-white">Gas Fees</span>
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
                onClick={swap}
                type="button"
                className="col-span-7 mt-5 w-full rounded-full border border-transparent bg-white py-2 px-4 text-base font-medium text-wagpay-dark hover:bg-indigo-50"
              >
                Swap
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SwapCard;
