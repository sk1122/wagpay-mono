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
const index_1 = require("../../../index");
class ProductController {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.query["id"]);
            let product;
            try {
                product = yield index_1.prisma.product.findFirst({
                    where: {
                        id: id,
                    },
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
            res.status(200).send(product);
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield index_1.prisma.product.findMany({
                where: {
                    userId: res.locals.user.id
                }
            });
            if (!products) {
                res.status(400).send({
                    error: "Can't find products",
                    status: 4000
                });
                return;
            }
            res.status(200).send(products);
        });
        this.getTotalProductsSold = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const total_sold = yield index_1.prisma.product.aggregate({
                _sum: {
                    sold: true
                },
                where: {
                    userId: res.locals.user.id
                }
            });
            if (!total_sold) {
                res.status(400).send({
                    error: "Can't find products",
                    status: 4000
                });
                return;
            }
            res.status(200).send(total_sold);
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const producData = req.body;
            let product;
            try {
                product = yield index_1.prisma.product.create({
                    data: producData,
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
            res.status(200).send(product);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const productId = Number(req.query.id);
            const productData = JSON.parse(req.body);
            let updatedProduct;
            try {
                updatedProduct = yield index_1.prisma.product.update({
                    where: {
                        id: productId,
                    },
                    data: productData,
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
            res.status(201).send(updatedProduct);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            let product;
            try {
                product = yield index_1.prisma.product.delete({
                    where: {
                        id: Number(id),
                    },
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
                return;
            }
            res.status(204).send(product);
        });
    }
}
exports.default = ProductController;
