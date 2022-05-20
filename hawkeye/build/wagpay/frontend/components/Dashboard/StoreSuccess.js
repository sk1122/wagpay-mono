"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/outline");
function StoreSuccess(props) {
    const [open, setOpen] = (0, react_1.useState)(true);
    return (<react_2.Transition.Root show={open} as={react_1.Fragment}>
      <react_2.Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <react_2.Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </react_2.Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <react_2.Transition.Child as={react_1.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <outline_1.CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <react_2.Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Store Created
                  </react_2.Dialog.Title>
                  <div className="mt-2">
                    <a href={`https://twitter.com/intent/tweet?text=${props.tweet_text}`}>
                      Tweet
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm" onClick={() => setOpen(false)}>
                  Go back to dashboard
                </button>
              </div>
            </div>
          </react_2.Transition.Child>
        </div>
      </react_2.Dialog>
    </react_2.Transition.Root>);
}
exports.default = StoreSuccess;
