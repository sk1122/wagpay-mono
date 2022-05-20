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
            const username = req.query['username'];
            const { data, error } = yield supabase_1.supabase
                .from('User')
                .select('username')
                .eq('username', username);
            if (error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
                const returnData = {
                    username: username,
                    is_available: true
                };
                res.status(200).send(returnData);
                return;
            }
            const returnData = {
                username: username,
                is_available: false
            };
            res.status(400).send(returnData);
        }
    });
}
exports.default = create;
