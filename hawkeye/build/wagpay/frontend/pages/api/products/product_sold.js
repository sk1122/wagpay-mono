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
const supabase_1 = require("../../../supabase");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = yield (0, verifyUser_1.default)(req, res);
        let { user, error } = yield supabase_1.supabase.auth.api.getUser(req.headers['bearer-token']);
        const { data: userData, error: userError } = yield supabase_1.supabase
            .from('User')
            .select('*')
            .eq('email', user === null || user === void 0 ? void 0 : user.email);
        if (!user || !userData || userError || (userData === null || userData === void 0 ? void 0 : userData.length) === 0) {
            console.log(error);
            res.status(400).send('Page was not created ' + JSON.stringify(error));
            return;
        }
        if (req.method === 'GET') {
            const { data, error } = yield supabase_1.supabase.rpc('total_products_sold', {
                user_id: userData[0].id
            });
            if (error) {
                console.log(error);
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            console.log(data);
            res.status(201).send(data);
        }
    });
}
exports.default = get;
