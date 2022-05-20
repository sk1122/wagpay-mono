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
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../../../supabase");
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === 'GET') {
            const slug = req.query['id'];
            let { data, error } = yield supabase_1.supabase
                .from('pages')
                .select('*')
                .eq('id', slug);
            console.log(data);
            if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            let { data: productData, error: productError } = yield supabase_1.supabase
                .from('product_page')
                .select('product_id!inner(*)')
                .eq('page_id', data[0].id);
            if (!productData || error || (productData === null || productData === void 0 ? void 0 : productData.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(productError));
                return;
            }
            productData = productData === null || productData === void 0 ? void 0 : productData.map(product => product.product_id);
            data[0].products = productData;
            res.status(201).send(data[0]);
        }
    });
}
exports.default = create;
