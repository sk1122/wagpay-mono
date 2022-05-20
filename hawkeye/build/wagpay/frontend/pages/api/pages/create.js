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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const supabase_1 = require("../../../supabase");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const createProducts_1 = __importDefault(require("../utils/createProducts"));
const connect_product_to_pages_1 = __importDefault(require("../utils/connect_product_to_pages"));
const uploadFile = (file, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase.storage
        .from('store')
        .upload(`${projectId}`, file, {
        cacheControl: '3600',
        upsert: false,
    });
    const { data: dataE, error: errorE } = yield supabase_1.supabase.storage.listBuckets();
    console.log(dataE, "DATAE");
    if (error)
        console.log(error, 'Errorx');
    console.log(data);
});
exports.uploadFile = uploadFile;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = yield (0, verifyUser_1.default)(req, res);
        let { user, error } = yield supabase_1.supabase.auth.api.getUser(req.headers['bearer-token']);
        if (!user) {
            res.status(400).send("Wrong User");
            return;
        }
        const { data: userData, error: userError } = yield supabase_1.supabase
            .from('User')
            .select('*')
            .eq('email', user.email);
        if (!userData || error || userData.length == 0) {
            res.status(400).send("Wrong User");
            return;
        }
        if (req.method === 'POST') {
            const pageData = JSON.parse(req.body);
            let { products, logo } = pageData, page = __rest(pageData, ["products", "logo"]);
            console.log(logo, "LOGO");
            page.user = userData[0].id;
            if (!page.eth_address)
                page.eth_address = userData[0].eth_address;
            if (!page.sol_address)
                page.sol_address = userData[0].sol_address;
            console.log(page, products);
            const { data, error } = yield supabase_1.supabase
                .from('pages')
                .insert([page]);
            if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            let product_ids = yield (0, createProducts_1.default)(products, userData[0].id, data[0].id);
            let connect_product = yield (0, connect_product_to_pages_1.default)(product_ids, data[0].id);
            // uploadFile(logo, data[0].id)
            res.status(201).send(data[0]);
        }
    });
}
exports.default = create;
