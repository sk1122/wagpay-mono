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
exports.create_unique_button_id = void 0;
const client_1 = require("../client");
function create_unique_button_id(store_id, invoice_id, created_at) {
    return __awaiter(this, void 0, void 0, function* () {
        var button_id = Math.random().toString(36).slice(2);
        const { data, error } = yield client_1.supabase.from('Payment Button').select('unique_id').csv();
        const ids = data === null || data === void 0 ? void 0 : data.split('\n').splice(1);
        while (ids === null || ids === void 0 ? void 0 : ids.find(id => id === button_id)) {
            button_id = Math.random().toString(36).slice(2);
        }
        return button_id;
    });
}
exports.create_unique_button_id = create_unique_button_id;
