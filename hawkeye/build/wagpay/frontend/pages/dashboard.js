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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Overview_1 = __importDefault(require("../components/Dashboard/Overview"));
const Pages_1 = __importDefault(require("../components/Dashboard/Pages"));
const Transactions_1 = __importDefault(require("../components/Dashboard/Transactions"));
const Products_1 = __importDefault(require("../components/Dashboard/Products"));
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/outline");
const solid_1 = require("@heroicons/react/solid");
const supabase_1 = require("../supabase");
const PageHeader_1 = __importDefault(require("../components/Dashboard/PageHeader"));
const router_1 = require("next/router");
const blockies = __importStar(require("ethereum-blockies-png"));
const navigation = [
    { name: 'Overview', comp_name: 'overview', icon: outline_1.HomeIcon, current: true },
    { name: 'Pages', comp_name: 'pages', icon: outline_1.CollectionIcon, current: false },
    {
        name: 'Products',
        comp_name: 'products',
        icon: outline_1.ShoppingCartIcon,
        current: false,
    },
    {
        name: 'Transactions',
        comp_name: 'transactions',
        icon: outline_1.CreditCardIcon,
        current: false,
    },
    { name: 'Settings', comp_name: 'settings', icon: outline_1.CogIcon, current: false },
];
const secondaryNavigation = [
    { name: 'Help', href: '#', icon: outline_1.QuestionMarkCircleIcon },
    { name: 'Privacy', href: '#', icon: outline_1.ShieldCheckIcon },
];
const cards = [
    { name: 'Total visits', href: '#', icon: outline_1.TrendingUpIcon, amount: '0' },
    {
        name: 'Products Sold',
        href: '#',
        icon: outline_1.TrendingUpIcon,
        amount: '0',
    },
    { name: 'Earned', href: '#', icon: solid_1.CashIcon, amount: '0' },
    { name: 'Pages', href: '#', icon: outline_1.CollectionIcon, amount: '0' },
    // More items...
];
const transactions = [
    {
        id: 1,
        productName: '2 Kg Ganja',
        pageName: 'Page Name',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 2,
        productName: '2 Kg Ganja',
        pageName: 'Page Name',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    {
        id: 3,
        productName: '2 Kg Ganja',
        pageName: 'Page Name',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    // More transactions...
];
const statusStyles = {
    success: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-gray-100 text-gray-800',
};
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
function Dashboard() {
    const { push } = (0, router_1.useRouter)();
    const [sidebarOpen, setSidebarOpen] = (0, react_1.useState)(false);
    const [currentTab, setCurrentTab] = (0, react_1.useState)('overview');
    const [user, setUser] = (0, react_1.useState)({});
    const [visits, setVisits] = (0, react_1.useState)(0);
    const [money, setMoney] = (0, react_1.useState)('$0');
    const [sold, setSold] = (0, react_1.useState)(0);
    const [running, setRunning] = (0, react_1.useState)(false);
    const [img, setImg] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const dataURL = blockies.createDataURL({ seed: user.username });
        setImg(dataURL);
    }, [user]);
    (0, react_1.useLayoutEffect)(() => {
        try {
            const user = supabase_1.supabase.auth.user();
            console.log('user1');
            if (!user) {
                console.log('user');
                push('/auth');
                return;
            }
            console.log('user2');
        }
        catch (e) {
            push('/auth');
            console.log('not logged in');
            return;
        }
        setRunning(true);
    }, []);
    (0, react_1.useEffect)(() => console.log(running, 'running'), [running]);
    const getMoneyEarned = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (running) {
            const data = yield fetch('/api/products/money_earned', {
                headers: {
                    'bearer-token': (_a = supabase_1.supabase.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token,
                },
            });
            const res = yield data.json();
            cards[2].amount = '$' + res;
            setMoney('$' + res);
        }
    });
    const totalProductSold = () => __awaiter(this, void 0, void 0, function* () {
        var _b;
        if (running) {
            const data = yield fetch('/api/products/product_sold', {
                headers: {
                    'bearer-token': (_b = supabase_1.supabase.auth.session()) === null || _b === void 0 ? void 0 : _b.access_token,
                },
            });
            const res = yield data.json();
            cards[1].amount = res;
            setSold(res);
        }
    });
    const totalVisits = () => __awaiter(this, void 0, void 0, function* () {
        var _c;
        if (running) {
            const data = yield fetch('/api/pages/visits', {
                headers: {
                    'bearer-token': (_c = supabase_1.supabase.auth.session()) === null || _c === void 0 ? void 0 : _c.access_token,
                },
            });
            const res = yield data.json();
            cards[0].amount = res;
            console.log(cards[0]);
            setVisits(res);
        }
    });
    const totalPages = () => __awaiter(this, void 0, void 0, function* () {
        var _d;
        if (running) {
            const data = yield fetch('/api/pages/number_of_pages', {
                headers: {
                    'bearer-token': (_d = supabase_1.supabase.auth.session()) === null || _d === void 0 ? void 0 : _d.access_token,
                },
            });
            const res = yield data.json();
            cards[3].amount = res;
            setVisits(res);
        }
    });
    (0, react_1.useEffect)(() => {
        if (running) {
            getMoneyEarned();
            totalProductSold();
            totalVisits();
            totalPages();
        }
    }, [running]);
    const changeTab = (nextTab, nextId) => {
        const index = navigation
            .map((e) => {
            return e.comp_name;
        })
            .indexOf(currentTab);
        if (index === -1)
            return;
        navigation[index].current = false;
        navigation[nextId].current = true;
        setCurrentTab(nextTab);
    };
    const getUser = () => __awaiter(this, void 0, void 0, function* () {
        var _e;
        const data = yield fetch(`/api/user/get?email=${(_e = supabase_1.supabase.auth.user()) === null || _e === void 0 ? void 0 : _e.email}`);
        const res = yield data.json();
        setUser(res);
    });
    (0, react_1.useEffect)(() => {
        getUser();
    }, [supabase_1.supabase.auth.user()]);
    return (<>
      <div className="min-h-full font-urban">
        <react_2.Transition.Root show={sidebarOpen} as={react_1.Fragment}>
          <react_2.Dialog as="div" className="fixed inset-0 z-40 flex lg:hidden" onClose={setSidebarOpen}>
            <react_2.Transition.Child as={react_1.Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
              <react_2.Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
            </react_2.Transition.Child>
            <react_2.Transition.Child as={react_1.Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                <react_2.Transition.Child as={react_1.Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button type="button" className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <outline_1.XIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                    </button>
                  </div>
                </react_2.Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="font-inter text-2xl font-extrabold text-white">
                    WagPay
                  </h1>
                </div>
                <nav className="mt-5 h-full flex-shrink-0 divide-y divide-indigo-800 overflow-y-auto" aria-label="Sidebar">
                  <div className="space-y-1 px-2">
                    {navigation.map((item, idx) => (<a key={item.name} onClick={() => changeTab(item.comp_name, idx)} className={classNames(item.current
                ? 'bg-indigo-500 text-white'
                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white', 'group flex items-center rounded-md px-2 py-2 text-base font-medium')} aria-current={item.current ? 'page' : undefined}>
                        <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-200" aria-hidden="true"/>
                        {item.name}
                      </a>))}
                  </div>
                  <div className="mt-6 pt-6">
                    <div className="space-y-1 px-2">
                      {secondaryNavigation.map((item) => (<a key={item.name} href={item.href} className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white">
                          <item.icon className="mr-4 h-6 w-6 text-indigo-200" aria-hidden="true"/>
                          {item.name}
                        </a>))}
                    </div>
                  </div>
                </nav>
              </div>
            </react_2.Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </react_2.Dialog>
        </react_2.Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-700 pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-extrabold text-white">WagPay</h1>
            </div>
            <nav className="mt-5 flex flex-1 flex-col divide-y divide-indigo-800 overflow-y-auto" aria-label="Sidebar">
              <div className="space-y-1 px-2">
                {navigation.map((item, idx) => (<a key={item.name} onClick={() => changeTab(item.comp_name, idx)} className={classNames(item.current
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white', 'group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm font-medium leading-6')} aria-current={item.current ? 'page' : undefined}>
                    <item.icon className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-200" aria-hidden="true"/>
                    {item.name}
                  </a>))}
              </div>
              <div className="mt-6 pt-6">
                <div className="space-y-1 px-2">
                  {secondaryNavigation.map((item) => (<a key={item.name} href={item.href} className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-indigo-100 hover:bg-indigo-600 hover:text-white">
                      <item.icon className="mr-4 h-6 w-6 text-indigo-200" aria-hidden="true"/>
                      {item.name}
                    </a>))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button type="button" className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <outline_1.MenuAlt1Icon className="h-6 w-6" aria-hidden="true"/>
            </button>
            {/* Search bar */}
            <div className="flex flex-1 justify-end px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <react_2.Menu as="div" className="relative ml-3">
                  <div>
                    <react_2.Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <img className="h-8 w-8 rounded-full" src={img} alt=""/>
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        gm, {user.username}
                      </span>
                      <solid_1.ChevronDownIcon className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block" aria-hidden="true"/>
                    </react_2.Menu.Button>
                  </div>
                  <react_2.Transition as={react_1.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <react_2.Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <react_2.Menu.Item>
                        {({ active }) => (<a href="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Your Profile
                          </a>)}
                      </react_2.Menu.Item>
                      <react_2.Menu.Item>
                        {({ active }) => (<a href="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Settings
                          </a>)}
                      </react_2.Menu.Item>
                      <react_2.Menu.Item>
                        {({ active }) => (<button onClick={() => { supabase_1.supabase.auth.signOut(); push('/auth'); }} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Logout
                          </button>)}
                      </react_2.Menu.Item>
                    </react_2.Menu.Items>
                  </react_2.Transition>
                </react_2.Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            {/* Page header */}
            <PageHeader_1.default user={user}/>
            {currentTab === 'overview' && <Overview_1.default cards={cards} username={user.username}/>}
            {currentTab === 'pages' && <Pages_1.default cards={cards} username={user.username}/>}
            {currentTab === 'transactions' && <Transactions_1.default cards={cards}/>}
            {currentTab === 'products' && <Products_1.default cards={cards}/>}
            {/* {currentTab === 'settings' && (
          <Settings cards={cards} transactions={transactions} />
        )} */}
          </main>
        </div>
      </div>
    </>);
}
exports.default = Dashboard;
