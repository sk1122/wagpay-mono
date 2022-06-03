import type { Routes } from '@wagpay/sdk/dist/types';
import { ethers } from 'ethers';
import React from 'react';

interface IBridgeBarProps {
  bridge: Routes;
}

const BridgeBar = ({ bridge }: IBridgeBarProps) => {
  return (
    <>
      <div className="relative w-full">
        <div className="mx-4 grid grid-cols-7 rounded-lg bg-wagpay-dark py-6 px-2 shadow sm:mx-auto sm:w-full sm:px-6">
          {/* left part */}
          <div className="col-span-2 flex flex-col items-center justify-center space-y-2 space-x-4 lg:flex-row">
            <div>
              <img src="/images/currency/usdcBadge.png" alt="usdc" />
            </div>
            <div className="flex flex-col space-y-1 text-center">
              <span className="text-center text-sm text-white md:text-xl">
                {ethers.utils.formatUnits(
                  bridge.route.amount,
                  bridge.route.fromToken.decimals
                )}{' '}
              </span>
              <span className="text-center text-xs text-white">
                on {bridge.route.fromToken.name}
              </span>
            </div>
          </div>
          {/* center part */}
          <div className="col-span-3 flex items-center space-x-3">
            <div className="h-[1px] w-1/3 border border-dashed border-gray-500" />
            <div className="flex w-fit items-center justify-center space-x-2 rounded-full bg-gray-700 py-1 px-4 text-xs text-white sm:w-1/3">
              <img src="/images/bridgeBadge.png" alt="bridge" />
              <span>{bridge.name}</span>
            </div>
            <div className="h-[1px] w-1/3 border border-dashed border-gray-500" />
          </div>
          {/* right part */}
          <div className="col-span-2 flex flex-col items-center justify-center space-y-2 space-x-4 lg:flex-row">
            <div>
              <img src="/images/currency/usdcBadge.png" alt="usdc" />
            </div>
            <div className="flex flex-col space-y-1 text-center">
              <span className="text-center text-sm text-white md:text-xl">
                {Number(bridge.amountToGet).toFixed(2)}
              </span>
              <span className="text-center text-xs text-white">
                on {bridge.route.toToken.name}
              </span>
            </div>
          </div>
        </div>
        {/* bottom pills */}
        <div className="absolute mobile:w-full">
          <div className="flex items-center justify-center mobile:space-x-4">
            <div className="flex items-center space-x-2 rounded-b-xl bg-gray-300 p-1 text-sm mobile:px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888888"
                  d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-4.025q0-.425-.287-.7Q12.425 11 12 11t-.712.287Q11 11.575 11 12v4.025q0 .425.288.7q.287.275.712.275Zm0-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                ></path>
              </svg>
              <span className="text-xs">1 User Action</span>
            </div>
            <div className="flex items-center space-x-2 rounded-b-xl bg-gray-300 px-4 py-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888888"
                  d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-4.025q0-.425-.287-.7Q12.425 11 12 11t-.712.287Q11 11.575 11 12v4.025q0 .425.288.7q.287.275.712.275Zm0-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                ></path>
              </svg>
              <span className="text-xs">$ {bridge.transferFee} Gas Fee</span>
            </div>
            <div className="flex items-center space-x-2 rounded-b-xl bg-gray-300 px-4 py-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888888"
                  d="M12 17q.425 0 .713-.288Q13 16.425 13 16v-4.025q0-.425-.287-.7Q12.425 11 12 11t-.712.287Q11 11.575 11 12v4.025q0 .425.288.7q.287.275.712.275Zm0-8q.425 0 .713-.288Q13 8.425 13 8t-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8t.288.712Q11.575 9 12 9Zm0 13q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"
                ></path>
              </svg>
              <span className="text-xs">- {bridge.bridgeTime}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BridgeBar;
