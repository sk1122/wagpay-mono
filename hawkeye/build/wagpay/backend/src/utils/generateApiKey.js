"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAPIKey = void 0;
const uuid_by_string_1 = __importDefault(require("uuid-by-string"));
const crypto_1 = __importDefault(require("crypto"));
const generateAPIKey = (user_id, store_id, store_name) => {
    const random = crypto_1.default.randomBytes(20).toString('hex');
    const api_key = (0, uuid_by_string_1.default)(`${user_id} ${store_id} ${store_name} ${random}`);
    return api_key;
};
exports.generateAPIKey = generateAPIKey;
