"use strict";
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
const supabase_1 = require("../supabase");
const react_1 = require("react");
const router_1 = require("next/router");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const Auth = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const { push } = (0, router_1.useRouter)();
    const getOrCreateUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
        let { data, error } = yield supabase_1.supabase.from('User').select('*').eq('email', email);
        if (error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
            (0, react_hot_toast_1.default)('Claim a username first');
            push('/claim');
            return false;
        }
        return true;
    });
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        console.log(email);
        let alreadyUser = yield getOrCreateUser(email);
        if (alreadyUser) {
            const promise = supabase_1.supabase.auth.signIn({ email });
            react_hot_toast_1.default.promise(promise, {
                loading: 'Sending Email',
                success: 'Successfully send email',
                error: "Can't send email"
            });
        }
    });
    return (<div className="border rounded-lg p-12 w-11/12 lg:w-4/12 mx-auto my-48">
		<h3 className="font-extrabold text-3xl">Ahoy!</h3>
  
		<p className="text-gray-500 text-sm mt-4">
		  Fill in your email, we'll send you a magic link.
		</p>
  
		<form onSubmit={handleSubmit}>
			<input type="email" placeholder="Your email address" className="border w-full p-3 rounded-lg mt-4 focus:border-indigo-500" onChange={e => setEmail(e.target.value)}/>
  
		  <button type="submit" className="bg-indigo-500 text-white w-full p-3 rounded-lg mt-8 hover:bg-indigo-700">
			Let's go!
		  </button>
		</form>
	  </div>);
};
exports.default = Auth;
