import React from 'react';

interface ISelectProps {
  label?: string;
  classes: string;
  selectId: string;
  selectName: string;
  value: string;
  setValue: Function;
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
        <option
          value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          className="bg-wagpay-dark"
        >
          MATIC
        </option>
        <option
          value="0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
          className="bg-wagpay-dark"
        >
          ETH
        </option>
        <option
          value="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          className="bg-wagpay-dark"
        >
          USDC
        </option>
        <option
          value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
          className="bg-wagpay-dark"
        >
          USDT
        </option>
      </select>
    </>
  );
};

export default CoinSelect;
