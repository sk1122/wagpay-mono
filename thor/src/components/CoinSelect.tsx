import type { Coin } from '@wagpay/sdk/dist/types/coin/coin.type';
import React from 'react';

interface ISelectProps {
  label?: string;
  classes: string;
  selectId: string;
  selectName: string;
  value: string;
  setValue: Function;
  supportedCoins: Coin[];
}

// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(' ');
// }

const CoinSelect = ({
  label,
  classes,
  selectId,
  selectName,
  value,
  setValue,
  supportedCoins,
}: ISelectProps) => {
  return (
    <>
      {label && (
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
        {supportedCoins?.map((coin, index) => (
          <option key={index} value={coin.coinKey} className="bg-wagpay-dark">
            {coin.coinName}
          </option>
        ))}
      </select>
    </>
  );
};

export default CoinSelect;
