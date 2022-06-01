import type { Coin } from '@wagpay/sdk/dist/types/coin/coin.type';
import React, { useState } from 'react';

interface ISelectProps {
  value: string;
  setValue: Function;
  supportedCoins: Coin[];
}

const CoinSelect = ({ supportedCoins, value, setValue }: ISelectProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const selectedCoin = (coin: Coin) => {
    setValue(coin.coinKey);
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    <>
      <div className="relative w-2/5">
        <div
          className="flex flex-row overflow-hidden rounded-r-md"
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
        >
          <div className="flex h-12 w-full cursor-pointer select-none flex-row justify-between bg-gray-700 px-1 text-white">
            <div className="flex flex-row items-center">
              <img
                className="mr-2.5 rounded-md bg-gray-300 object-cover"
                src="https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg"
                alt="chain_icon"
              />
              <span className="leading-6">{value}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-7 transition duration-200 ease-in-out"
            >
              <path
                fill="#D0D0D0"
                d="M17 9.17a1 1 0 00-1.41 0L12 12.71 8.46 9.17a1 1 0 00-1.41 0 1 1 0 000 1.42l4.24 4.24a1 1 0 001.42 0L17 10.59a1 1 0 000-1.42z"
              ></path>
            </svg>
          </div>
        </div>
        {isDropDownOpen && (
          <div className="absolute top-12 left-0 z-10 w-full overflow-hidden rounded-b-md bg-gray-700 text-white shadow">
            {supportedCoins.map((coin: Coin) => (
              <div
                key={coin.coinKey}
                className="flex h-11 w-full cursor-pointer select-none flex-row justify-between bg-gray-700 py-2.5 pl-3 pr-2 text-white hover:bg-gray-900"
                onClick={() => selectedCoin(coin)}
              >
                <div className="flex flex-row items-center">
                  <img
                    className="mr-2.5 h-6 w-6 rounded-md bg-gray-300 object-cover"
                    src="https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg"
                    alt="chain_icon"
                  />
                  <span className="leading-6">{coin.coinName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CoinSelect;