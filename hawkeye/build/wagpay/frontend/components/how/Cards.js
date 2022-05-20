"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("../Card"));
const Cards = () => {
    return (<div className="w-full h-content flex justify-center items-center">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:space-x-5">
				<Card_1.default></Card_1.default>
				<Card_1.default></Card_1.default>
				<Card_1.default></Card_1.default>
			</div>
		</div>);
};
exports.default = Cards;
