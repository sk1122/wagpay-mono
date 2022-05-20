"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageRouter = void 0;
const express_1 = require("express");
const PageController_1 = __importDefault(require("./controllers/PageController"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
exports.pageRouter = (0, express_1.Router)();
const pagesController = new PageController_1.default();
exports.pageRouter.get("/", [verifyUser_1.default], (req, res) => pagesController.get(req, res));
exports.pageRouter.get("/get/", (req, res) => pagesController.getFromSlug(req, res));
exports.pageRouter.get("/total_visits/", [verifyUser_1.default], (req, res) => pagesController.getTotalVisits(req, res));
exports.pageRouter.post("/", [verifyUser_1.default], (req, res) => pagesController.post(req, res));
exports.pageRouter.patch("/", [verifyUser_1.default], (req, res) => pagesController.update(req, res));
exports.pageRouter.delete("/", [verifyUser_1.default], (req, res) => pagesController.delete(req, res));
