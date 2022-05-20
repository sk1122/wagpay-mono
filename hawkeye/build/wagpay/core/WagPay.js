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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("./supabase");
class APIKeyInvalid {
}
class StoreNotFound {
}
class CantCreatePaymentIntent {
}
class WagPay {
    constructor(api_key) {
        this.can_run = false;
        if (!this.isValidAPIKey(api_key)) {
            throw new APIKeyInvalid();
        }
        this.can_run = true;
    }
    isValidAPIKey(api_key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase.from('User').select('*').eq('api_key', api_key).maybeSingle();
            if (!data || error) {
                return false;
            }
            this.user = data;
            return true;
        });
    }
    canRun() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.can_run) {
                throw new APIKeyInvalid();
            }
        });
    }
    getStore(store_slug) {
        return __awaiter(this, void 0, void 0, function* () {
            this.canRun();
            const { data, error } = yield supabase_1.supabase.from('pages').select('*').eq('slug', store_slug);
            if (!data || error) {
                throw new StoreNotFound();
            }
            return data[0];
        });
    }
    createPaymentIntent(payment_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.canRun();
            const store = yield this.getStore(payment_data.receiving_store);
            let r = (Math.random() + Math.floor(new Date().getTime() / 1000) + 1).toString(36).substring(7);
            payment_data.payment_id = r;
            payment_data.store_id = store.id;
            let { receiving_store } = payment_data, payment = __rest(payment_data, ["receiving_store"]);
            const { data, error } = yield supabase_1.supabase.from('payment_intents').insert([payment]);
            if (!data || error) {
                console.log(error, "ERROR");
                throw new CantCreatePaymentIntent();
            }
            return data[0].payment_id;
        });
    }
    checkPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const { data, error } = yield supabase_1.supabase.from('payment_intents').select('*').eq('payment_id', payment_id);
                if (!data || error) {
                    console.log(error, "ERROR");
                    throw new CantCreatePaymentIntent();
                }
                if (data[0].is_paid && data[0].transaction_hash) {
                    console.log('Paid');
                }
                else {
                    console.log('Not Paid');
                }
            }), 5000);
        });
    }
}
// (async () => {
// 	console.log('Initiating')
// 	const wag = new WagPay('123')
// 	console.log('Initiatied')
// 	console.log('Creating Payment')
// 	let pay: PaymentInterface = {
// 		value: 20,
// 		from_email: 'punekar.satyam@gmail.com',
// 		currency: ['SOL'],
// 		receiving_store: 'strings'
// 	}
// 	console.log('Created Payment')
// 	console.log('Creating Payment Intent')
// 	let id = await wag.createPaymentIntent(pay)
// 	wag.checkPayment(id)
// 	console.log('Created Payment Intent')
// })()
exports.default = WagPay;
