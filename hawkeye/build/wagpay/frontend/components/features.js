"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Banner_1 = __importDefault(require("../components/features/Banner"));
const Feature_1 = __importDefault(require("../components/features/Feature"));
const Points = [
    {
        invert: true,
        for: 'For Businesses',
        title: 'Wonderful and Effortless way to view your total Balance Balance',
        desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
    },
    {
        invert: false,
        for: 'For Businesses',
        title: 'Wonderful and Effortless way to view your total Balance Balance',
        desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
    },
    {
        invert: true,
        for: 'For Businesses',
        title: 'Wonderful and Effortless way to view your total Balance Balance',
        desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
    },
];
const Features = () => {
    return (<>
      <div className='w-full h-full bg-[#6C7EE1]/20 space-y-10 xl:space-y-0 pt-20'>
        <Banner_1.default />
        <div className="flex flex-col pt-20 space-y-10 lg:space-y-4 justify-center items-center">
          {Points.map((value) => (<Feature_1.default {...value}/>))}
        </div>
      </div>
    </>);
};
exports.default = Features;
