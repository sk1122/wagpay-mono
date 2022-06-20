import { FiRefreshCw } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import { useAppContext } from '@/context';


const PriorityBar = () => {
  const {isDropDownOpenp, setIsDropDownOpenp, priorties, priorityValue, setPRiorityValue} = useAppContext()

  return (
    <>
    <div className="mb-12 flex w-full items-center justify-between  p-4 ">
            <div className="flex">
              <p className='text-lg mx-3'>Select btidge to swap </p>
              <p className='flex text-[12px] text-white text-opacity-70'>refresh routes  <FiRefreshCw className="text-sm" /></p>
              
            </div>
            <div className=" bg-wagpay-card-bg-secondary px-4 py-2">
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
                  <div className="w-max absolute top-full z-50 mt-4  min-w-full rounded bg-wagpay-card-bg-secondary">
                    <ul className="rounded  text-left">
                      {priorties.map((item:any) => {
                        return (
                          <li
                            // @ts-ignore
                            onClick={(e) => {
                              setPRiorityValue(item);
                            }}
                            className="px-4  py-1  "
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