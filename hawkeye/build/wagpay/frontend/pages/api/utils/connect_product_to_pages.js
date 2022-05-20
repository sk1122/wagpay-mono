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
const connect_product_to_pages = (product_ids, pages) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < product_ids.length; i++) {
        const { data, error } = yield supabase_1.supabase.from('product_page').insert([{ product_id: product_ids[i], page_id: pages }]);
    }
    return true;
});
exports.default = connect_product_to_pages;
