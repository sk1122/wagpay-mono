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
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === 'POST') {
            const body = JSON.parse(req.body);
            const { data, error } = yield supabase_1.supabase.rpc('increment_sold', {
                product_id: body.product_id
            });
            if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
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
