"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyOrUser = exports.paymentIntentRouter = void 0;
const express_1 = require("express");
const PaymentIntentController_1 = __importDefault(require("./controllers/PaymentIntentController"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
const verifyAPIKey_1 = require("../../middlewares/verifyAPIKey");
exports.paymentIntentRouter = (0, express_1.Router)();
const paymentIntentController = new PaymentIntentController_1.default();
const apiKeyOrUser = (req, res, next) => {
    const list = Object.keys(req.headers);
    if (list.includes('bearer-token')) {
        return (0, verifyUser_1.default)(req, res, next);
    }
    else if (list.includes('api-key')) {
        return (0, verifyAPIKey_1.verifyAPIKey)(req, res, next);
    }
    else {
        throw "Either add bearer-token or api_key";
    }
};
exports.apiKeyOrUser = apiKeyOrUser;
exports.paymentIntentRouter.get("/", exports.apiKeyOrUser, (req, res) => paymentIntentController.get(req, res));
exports.paymentIntentRouter.get("/:id", (req, res) => paymentIntentController.getSingleIntent(req, res));
exports.paymentIntentRouter.post("/", [verifyAPIKey_1.verifyAPIKey], (req, res) => paymentIntentController.post(req, res));
exports.paymentIntentRouter.patch("/", (req, res) => paymentIntentController.update(req, res));
exports.paymentIntentRouter.delete("/", [verifyUser_1.default], (req, res) => paymentIntentController.delete(req, res));
