"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const solid_1 = require("@heroicons/react/solid");
const react_1 = require("react");
const blockies = __importStar(require("ethereum-blockies-png"));
const NewStore_1 = __importDefault(require("./NewStore"));
const PageHeader = ({ user }) => {
    const [img, setImg] = (0, react_1.useState)('');
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const dataURL = blockies.createDataURL({ seed: user.username });
        setImg(dataURL);
    }, [user]);
    return (<div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <img className="hidden h-16 w-16 rounded-full sm:block" src={img} alt=""/>
              <div>
                <div className="flex items-center">
                  <img className="h-16 w-16 rounded-full sm:hidden" src={img} alt=""/>
                  <h1 className="ml-3 font-inter text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                    Good morning, {user.username}
                  </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Company</dt>
                  <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                    <solid_1.OfficeBuildingIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                    India
                  </dd>
                  <dt className="sr-only">Account status</dt>
                  <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                    <solid_1.CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true"/>
                    Verified account
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button type="button" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Edit Profile
            </button>
            <button onClick={() => setIsOpen(true)} type="button" className="flex items-center space-x-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span>New Store</span>
              <span className="h-5 w-5">
                <solid_1.PlusIcon />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className={(isOpen ? '' : 'hidden ') +
            'absolute top-1/2 left-1/2 z-50 h-full w-full -translate-x-1/2 -translate-y-1/2 transform backdrop-blur-sm'}>
        <solid_1.XCircleIcon onClick={() => setIsOpen(false)} className="absolute top-10 right-1/3 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"/>
        <NewStore_1.default isOpen={isOpen} setIsOpen={setIsOpen} username={user.username}/>
      </div>
    </div>);
};
exports.default = PageHeader;
