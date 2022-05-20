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
const __1 = require("..");
const verifyAPIKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const api_key = req.headers["api-key"];
    console.log(api_key, "api_key");
    if (!api_key) {
        res.status(400).send({
            error: "Please send api_key",
            status: 400
        });
        return;
    }
    const user = yield __1.prisma.user.findUnique({
        where: {
            apiKey: api_key
        }
    });
    console.log(user);
    if (!user) {
        res.status(400).send({
            error: "Can't find User",
            status: 400
        });
        return;
    }
    res.locals.user = user;
    next();
});
exports.verifyAPIKey = verifyAPIKey;
