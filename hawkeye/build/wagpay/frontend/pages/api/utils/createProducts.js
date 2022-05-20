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
const createProducts = (products, userId, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    let products_data = [];
    for (let i = 0; i < products.length; i++) {
        let _a = products[i], { image } = _a, product = __rest(_a, ["image"]);
        product.user = userId;
        var { data, error } = yield supabase_1.supabase.from('product').upsert(product);
        console.log(data, error, "ERROR");
        if (!data || error || (data === null || data === void 0 ? void 0 : data.length) === 0) {
            return products_data;
        }
        // uploadFile(image, `${pageId.toString()}/${data[0].id.toString()}`)
        products_data.push(data[0].id);
    }
    return products_data;
});
exports.default = createProducts;
