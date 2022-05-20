"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@headlessui/react");
const react_2 = require("react");
const link_1 = __importDefault(require("next/link"));
function TransactionModal(props) {
    var _a, _b;
    return (<>
	<react_1.Transition appear show={props.isOpen} as={react_2.Fragment}>
        <react_1.Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => props.closeModal()}>
          <div className="min-h-screen px-4 text-center">
            <react_1.Transition.Child as={react_2.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <react_1.Dialog.Overlay className="fixed inset-0"/>
            </react_1.Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <react_1.Transition.Child as={react_2.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <div className="font-urban inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <react_1.Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {props.transaction.name}
                </react_1.Dialog.Title>
				<div className="mt-2 flex flex-col justify-center items-center space-y-3">
					<h1 className='text-xl'>Email: {props.transaction.email}</h1>
					{console.log(props.transaction)}
					{props.transaction.eth_address &&
            <div className='bg-cyan-400/20 rounded-xl p-3 flex justify-center items-center'>
							{!props.transaction.transaction_hash ? <span>❌</span> : <span>✅</span>}	
							<a target='_blank' href={`https://etherscan.io/tx/${props.transaction.transaction_hash}`} className='flex space-x-3'>
								<span>See Transaction on</span> <img src="https://etherscan.io/images/brandassets/etherscan-logo.png" className='w-28' alt=""/>
							</a>
						</div>}
					{props.transaction.sol_address &&
            <div className='bg-cyan-400/20 rounded-xl p-3 flex justify-center items-center'>
							{!props.transaction.transaction_hash ? <span>❌</span> : <span>✅</span>}	
							<a target='_blank' href={`https://solscan.io/tx/${props.transaction.transaction_hash}`} className='flex space-x-3'>
								<span>See Transaction on</span> <img src="https://solscan.io/static/media/solana-solana-scan-blue.5ffb9996.svg" className='w-14' alt=""/>
							</a>
						</div>}
					<p className='flex space-x-2 font-bold'><span className='font-normal'>Store:</span><link_1.default href={`/${(_a = props.transaction.page_id) === null || _a === void 0 ? void 0 : _a.slug}`}>{(_b = props.transaction.page_id) === null || _b === void 0 ? void 0 : _b.title}</link_1.default></p>
					<p className=''>Amount: <span className='font-bold'>$ {props.transaction.total_prices}</span></p>
					<h1 className='text-xl font-bold'>Field Values</h1>
					{props.transaction.fields && props.transaction.fields.map((value) => {
            return <div key={value.name} className='flex space-x-3'>
							<p>{value.name}: </p>
							<p>{value.value}</p>
						</div>;
        })}
					<h1 className='text-xl font-bold'>Selected Products</h1>
					{props.transaction.products && props.transaction.products.map((product) => {
            return <div key={product.name} className='flex space-x-3'>
							<p>{product.name}</p>
							<p>{product.discounted_price}</p>
						</div>;
        })}
				</div>

                <div className="mt-4">
                  <button type="button" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" onClick={() => props.closeModal()}>
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </react_1.Transition.Child>
          </div>
        </react_1.Dialog>
      </react_1.Transition>
    </>);
}
exports.default = TransactionModal;
