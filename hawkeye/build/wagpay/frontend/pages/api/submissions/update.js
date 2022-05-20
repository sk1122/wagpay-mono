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
        if (req.method === 'POST') {
            const submissionData = JSON.parse(req.body);
            console.log(submissionData);
            const { data: sub_data, error } = yield supabase_1.supabase.from('submission')
                .update({
                transaction_hash: submissionData.transaction_hash,
            })
                .match({
                id: submissionData.id
            });
            console.log(sub_data);
            if (!sub_data || error || (sub_data === null || sub_data === void 0 ? void 0 : sub_data.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            if (submissionData.transaction_hash) {
                sub_data[0].products.map((value) => {
                    fetch('/api/products/increment_sold', {
                        method: 'POST',
                        body: JSON.stringify({
                            product_id: value
                        })
                    });
                });
            }
            res.status(201).send(submissionData);
        }
    });
}
exports.default = create;
