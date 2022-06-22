import WagPay from '@wagpay/sdk';
import {
  chainEnum,
  ChainId,
  coinEnum,
  CoinKey,
  Routes,
  tokens,
} from '@wagpay/types';
import type { Chain } from '@wagpay/types';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import BridgeBar from '@/components/swap/bridgeBar';
import Navbar2 from '@/components/Navbar2';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import Modal from '@/components/Modal';
import { db } from '@/utils/db';
import Loading from '@/components/swap/loading';
import EarlyAcess from '@/components/swap/EarlyAcess';
import { useAppContext } from '@/context';
import PriorityBar from '@/components/swap/priorityBar';
import SwapCard from '@/components/swap/swapCard';
import { useSigner } from 'wagmi';

const Swap = () => {
  const wagpay = new WagPay();

  const {
    access,
    setAccess,
    isModalOpen,
    setIsModalOpen,
    setIsDropDownOpenp,
    toChain,
    fromChain,
    setAccount,
    setIsAuthenticated,
    fromCoin,
    toCoin,
    swapping,
    setSwapping,
    setRouteToExecute,
    toggle,
    amount,
    setAmount,
    routes,
    setRoutes,
    setFilteredFromChains,
    setFilteredToChains,
    setSigner,
    setIsDropDownOpenFromCoin,
    setIsDropDownOpenToCoin
  } = useAppContext();


  const { data: signerData, isError, isLoading } = useSigner();
 
  useEffect(() => {
    if (signerData) {
      signerData.getAddress().then((address:any) => {
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
 
  useEffect(() => {
    checkWalletIsConnected();
  }, []);




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

  useEffect(() => {
    if (routes) setRouteToExecute(routes[0]);
  }, [routes]);

  useEffect(() => {
    FetcAvalabaleRoutes();
  }, [fromChain, toChain, fromCoin, toCoin]);

var t: any;
useEffect(() => {
  clearInterval(t)
  t = setTimeout(() => {
    FetcAvalabaleRoutes()
  }, 1000);
}, [amount])


useEffect(() => {
  const setIntervalRef = setInterval(() => {
    FetcAvalabaleRoutes()
  }, 60000)
  return clearInterval(setIntervalRef)
}, [])

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id != fromChain.id;
    });
    setFilteredFromChains([...filteredChains]);
  }, [toChain]);

  useEffect(() => {
    const filteredChains = wagpay.getSupportedChains().filter((chain) => {
      return chain.id != toChain.id;
    });
    setFilteredToChains([...filteredChains]);
  }, [fromChain]);



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
          setIsDropDownOpenToCoin(false);
          setIsDropDownOpenFromCoin(false)
        }}
      >
        <div
          className={
            toggle === false
              ? `col-span-5 mt-4 sm:mx-auto sm:w-full xl:col-span-2 xl:mt-12`
              : `col-span-5 mt-4 sm:mx-auto sm:w-full sm:max-w-md xl:mt-12`
          }
        >
          <div className="mx-4 rounded-lg py-8 px-4 shadow sm:mx-auto sm:max-w-md sm:px-6">
            {/* card starts here */}
            
            <SwapCard signerData= {signerData} />
          </div>
        </div>
        <div className="col-span-5 mt-12 mb-20 w-full sm:mx-auto sm:w-full xl:col-span-3 xl:mt-12">
          <PriorityBar />
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
                      <BridgeBar bridge={value} />
                    </div>
                  );
                })
              ) : (
                <>
                  {swapping && (
                    <>
                      <Loading />
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <EarlyAcess />
        </Modal>
      </div>
    </Main>
  );
};

export default Swap;
