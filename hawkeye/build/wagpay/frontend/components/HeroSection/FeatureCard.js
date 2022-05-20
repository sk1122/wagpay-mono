"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureCard = void 0;
const FeatureCard = (props) => {
    return (<>
            <div className="flex py-5 my-4  lg:m-0 max-w-[338px] m-auto">
                <div className="">
                    logo
                </div>
                <div className="ml-[5px]  ">
                    <p className="font-bold">{props.title}</p>
                    <p className="text-left">{props.text}</p>
                </div>
            </div>
        </>);
};
exports.FeatureCard = FeatureCard;
