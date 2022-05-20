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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_email = exports.send_webhook_data = void 0;
const __1 = require("..");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey('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');
const send_webhook_data = (page_id, message) => __awaiter(void 0, void 0, void 0, function* () {
    const page_data = yield __1.prisma.pages.findFirst({
        where: {
            id: page_id
        },
        select: {
            webhook_urls: true
        }
    });
    const webhook_urls = page_data === null || page_data === void 0 ? void 0 : page_data.webhook_urls;
    if (!webhook_urls)
        return;
    webhook_urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield (0, cross_fetch_1.default)(url, {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = yield data.json();
            console.log(res);
        }
        catch (e) {
            console.log(e, url);
        }
    }));
});
exports.send_webhook_data = send_webhook_data;
const send_email = (page_id, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mail = yield mail_1.default.send(message);
    console.log(mail);
});
exports.send_email = send_email;
