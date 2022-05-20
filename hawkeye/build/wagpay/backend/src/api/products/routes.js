"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const ProductController_1 = __importDefault(require("./controller/ProductController"));
exports.productRouter = (0, express_1.Router)();
const productController = new ProductController_1.default();
exports.productRouter.get("/", (req, res) => productController.get(req, res));
exports.productRouter.post("/", (req, res) => productController.post(req, res));
exports.productRouter.post("/", (req, res) => productController.update(req, res));
exports.productRouter.post("/", (req, res) => productController.delete(req, res));
