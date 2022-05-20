"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = __importDefault(require("../components/designed/hero"));
const DoubleCard_1 = __importDefault(require("../components/designed/DoubleCard"));
const Points = [
    {
        invert: true,
        for: 'For Businesses',
        title: 'The world’s most powerful and easy-to-use APIs',
        desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
        point1: 'Point 1',
        point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
        point2: 'Point 1',
        point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    },
    {
        invert: false,
        for: 'For SMBs',
        title: 'The world’s most powerful and easy-to-use APIs',
        desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
        point1: 'Point 1',
        point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
        point2: 'Point 1',
        point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    }
];
const Designed = () => {
    return (<>
      <div className='w-full h-full  bg-[#6C7EE1]/20 space-y-10 xl:space-y-0 pt-20'>
        <hero_1.default></hero_1.default>
        <div className="flex flex-col space-y-20 lg:space-y-20 xl:space-y-20 justify-center items-center">
          {Points.map((value) => (<DoubleCard_1.default {...value}></DoubleCard_1.default>))}
        </div>
      </div>
    </>);
};
exports.default = Designed;
