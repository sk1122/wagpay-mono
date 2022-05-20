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
            req.body = JSON.parse(req.body);
            console.log(req.body);
            let user = req.body;
            user.is_paid = false;
            console.log(user);
            const { data, error } = yield supabase_1.supabase
                .from('User')
                .insert([user]);
            if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
                res.status(400).send('Page was not created ' + JSON.stringify(error));
                return;
            }
            res.status(201).send(user);
        }
    });
}
exports.default = create;
