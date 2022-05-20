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
exports.verifyAPIKey = void 0;
const client_1 = require("../client");
const verifyAPIKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const store_id = req.params['store'];
    const api_key = req.headers['api_key'];
    const { data, error } = yield client_1.supabase
        .from('Store')
        .select('*')
        .eq('id', store_id);
    if (error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
        res.status(400).send('API Key not found:(');
        return;
    }
    if (data[0].api_key === api_key || data[0].is_api_key_valid) {
        res.locals.is_api_key_valid = true;
    }
    else {
        res.status(400).send('WagPay: API Key not valid');
        return;
    }
    next();
});
exports.verifyAPIKey = verifyAPIKey;
