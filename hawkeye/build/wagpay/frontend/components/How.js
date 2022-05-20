"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Banner_1 = __importDefault(require("./how/Banner"));
const Steps_1 = __importDefault(require("./how/Steps"));
const Cards_1 = __importDefault(require("./how/Cards"));
const How = () => {
    return (<>
      <div className='w-full h-full xl:h-screen bg-[#6C7EE1]/20'>
        <Banner_1.default></Banner_1.default>
        <Steps_1.default></Steps_1.default>
        <Cards_1.default></Cards_1.default>
      </div>
    </>);
};
exports.default = How;
