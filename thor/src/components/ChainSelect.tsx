import type { Chain } from '@wagpay/sdk/dist/types/chain/chain.type';
import React, { useEffect, useState } from 'react';

interface ISelectProps {
  label?: string;
  classes: string;
  selectId: string;
  selectName: string;
  value: string;
  setValue: Function;
  supportedChains: Chain[];
}

// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(' ');
// }

const ChainSelect = ({
  label,
  classes,
  selectId,
  selectName,
  value,
  setValue,
  supportedChains,
}: ISelectProps) => {
  const [selectedChain, setSelectedChain] = useState('');

  const chainSelection = (e: any) => {
    setSelectedChain(e.target.innerText);
    setopenDropDown(!openDropDown);
  };

  useEffect(() => {
    console.log(selectedChain);
  }, [selectedChain]);

  const [openDropDown, setopenDropDown] = useState(false);

  return (
    <>
      {label && (
        <label htmlFor="from" className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="flex flex-row overflow-hidden rounded-xl border border-gray-200"
          onClick={() => setopenDropDown(!openDropDown)}
        >
          <div className="flex h-11 w-full cursor-pointer select-none flex-row justify-between bg-white py-2.5 pl-3 pr-2">
            <div className="flex flex-row items-center">
              <img
                className="mr-2.5 h-6 w-6 rounded-md bg-gray-300 object-cover"
                src="https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg"
              />
              <span className="leading-6">{selectedChain}</span>
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
        {openDropDown && (
          <div className="absolute top-12 left-0 z-10 w-full overflow-hidden rounded-xl bg-white shadow">
            <div
              className="flex h-11 w-full cursor-pointer select-none flex-row justify-between bg-white py-2.5 pl-3 pr-2 hover:bg-gray-100"
              onClick={(e) => chainSelection(e)}
            >
              <div className="flex flex-row items-center">
                <img
                  className="mr-2.5 h-6 w-6 rounded-md bg-gray-300 object-cover"
                  src="https://movricons.s3.ap-south-1.amazonaws.com/Optimism.svg"
                />
                <span className="leading-6">Optimism</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* {label && (
        <label htmlFor="from" className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={selectName}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`common-select ${classes}`}
      >
        {supportedChains.map((chain) => (
          <option key={chain.id} value={chain.id} className="bg-wagpay-dark">
            {chain.chain}
          </option>
        ))}
      </select> */}
    </>
  );
};

export default ChainSelect;
