import { FiRefreshCw } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import { useState } from 'react';
import { useAppContext } from '@/context';


const PriorityBar = () => {
  const {isDropDownOpenp, setIsDropDownOpenp, priorties, priorityValue, setPRiorityValue} = useAppContext()

  return (
    <>
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
                      {priorties.map((item:any) => {
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
    </>
  )
}

export default PriorityBar;