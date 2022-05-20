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
const supabase_1 = require("../../../supabase");
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === 'POST') {
            const submissionData = JSON.parse(req.body);
            let submission = __rest(submissionData, []);
            let products = submissionData.products;
            if (products.length <= 0) {
                res.status(403).send('Select Products first!');
            }
            const { data: sub_data, error } = yield supabase_1.supabase.from('submission').insert([submission]);
            if (!sub_data || error || (sub_data === null || sub_data === void 0 ? void 0 : sub_data.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            for (let i = 0; i < products.length; i++) {
                const { data, error } = yield supabase_1.supabase.from('bought').insert([{ product_id: products[i], submission_id: sub_data[0].id }]);
                if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
                    res.status(400).send('Page was not created ' + JSON.stringify(error));
                    return;
                }
            }
            res.status(201).send(sub_data[0]);
        }
    });
}
exports.default = create;
