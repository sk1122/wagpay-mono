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

const ChainSelect = ({
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
        <option value="137" className="bg-wagpay-dark">
          Polygon
        </option>
        <option value="1" className="bg-wagpay-dark">
          Ethereum
        </option>
      </select>
    </>
  );
};

export default ChainSelect;
