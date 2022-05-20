"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = void 0;
const express_1 = require("express");
const InvoiceController_1 = __importDefault(require("./controller/InvoiceController"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
exports.invoiceRouter = (0, express_1.Router)();
const invoiceController = new InvoiceController_1.default();
exports.invoiceRouter.get("/", [verifyUser_1.default], (req, res) => invoiceController.get(req, res));
exports.invoiceRouter.get("/:id", (req, res) => invoiceController.getById(req, res));
exports.invoiceRouter.post("/", [verifyUser_1.default], (req, res) => invoiceController.post(req, res));
exports.invoiceRouter.patch("/", [verifyUser_1.default], (req, res) => invoiceController.update(req, res));
exports.invoiceRouter.delete("/", [verifyUser_1.default], (req, res) => invoiceController.delete(req, res));
