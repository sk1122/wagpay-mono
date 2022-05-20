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
class InvoiceController {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = {};
            Object.keys(req.query).map(value => { if (isNumeric(req.query[value]))
                data[value] = Number(req.query[value]); });
            const paymentIntent = yield index_1.prisma.invoice.findMany({
                where: {
                    page: {
                        userId: res.locals.user.id
                    }
                }
            });
            let return_data = {
                cursor: 0,
                data: paymentIntent
            };
            res.status(200).send(return_data);
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const paymentIntent = yield index_1.prisma.invoice.findMany({
                where: {
                    id: req.query.id
                },
                include: {
                    products: true
                }
            });
            res.status(200).send(paymentIntent[0]);
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let invoiceData = req.body;
            var invoice;
            try {
                invoice = yield index_1.prisma.invoice.create({
                    data: invoiceData
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
            res.status(201).send(invoice);
        });
        this.batch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoiceData = req.body;
            var invoice;
            try {
                invoice = yield index_1.prisma.invoice.createMany({
                    data: invoiceData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(invoice);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { id } = _a, invoiceData = __rest(_a, ["id"]);
            var invoice;
            try {
                invoice = yield index_1.prisma.invoice.update({
                    where: {
                        id: id
                    },
                    data: invoiceData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(200).send(invoice);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            var invoice;
            try {
                invoice = yield index_1.prisma.invoice.delete({
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
            res.status(204).send(invoice);
        });
    }
}
exports.default = InvoiceController;
