"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSection = void 0;
const features_1 = require("./features");
const HeroText_1 = require("./HeroText");
const HeroSection = () => {
    return (<>
            <div className="z-40 py-[150px] lg:py-[150px] w-[90%] m-auto lg:w-[90%]">
                <HeroText_1.HeroText />
                <features_1.Features />
            </div>
        </>);
};
exports.HeroSection = HeroSection;
