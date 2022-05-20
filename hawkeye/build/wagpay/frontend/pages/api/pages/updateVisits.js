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
        if (req.method === 'PATCH') {
            let page_id = Number(req.query['id']);
            const { data, error } = yield supabase_1.supabase.rpc('increment_visit', {
                page_id: page_id
            });
            if (error) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            res.status(201).send(true);
        }
    });
}
exports.default = create;
