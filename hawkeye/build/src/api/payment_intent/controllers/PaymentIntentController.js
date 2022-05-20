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
const index_1 = require("../../../index");
function isNumeric(str) {
    if (typeof str != "string")
        return false; // we only process strings!  
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}
class PaymentIntentController {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.query;
            console.log(res.locals.user.id, data);
            const paymentIntent = yield index_1.prisma.paymentIntent.findMany({
                where: Object.assign({ page: {
                        userId: res.locals.user.id
                    } }, data)
            });
            res.status(200).send(paymentIntent);
        });
        this.getSingleIntent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const paymentIntent = yield index_1.prisma.paymentIntent.findFirst({
                where: {
                    id: id
                },
                include: {
                    page: true
                }
            });
            if (!paymentIntent) {
                res.status(400).send({
                    error: "Intent Doesn't Exists",
                    status: 400
                });
                return;
            }
            res.status(200).send(paymentIntent);
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let paymentIntentData = req.body;
            var paymentIntent;
            try {
                paymentIntent = yield index_1.prisma.paymentIntent.create({
                    data: paymentIntentData
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(paymentIntent);
        });
        this.batch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const paymentIntentData = req.body;
            var paymentIntent;
            try {
                paymentIntent = yield index_1.prisma.paymentIntent.createMany({
                    data: paymentIntentData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(paymentIntent);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { id } = _a, paymentIntentData = __rest(_a, ["id"]);
            var paymentIntent;
            try {
                paymentIntent = yield index_1.prisma.paymentIntent.update({
                    where: {
                        id: id
                    },
                    data: paymentIntentData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(200).send(paymentIntent);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            var paymentIntent;
            try {
                paymentIntent = yield index_1.prisma.paymentIntent.delete({
                    where: {
                        id: id
                    }
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(204).send(paymentIntent);
        });
    }
}
exports.default = PaymentIntentController;
