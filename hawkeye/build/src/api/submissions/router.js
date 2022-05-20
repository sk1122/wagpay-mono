"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionRouter = void 0;
const express_1 = require("express");
const SubmissionController_1 = __importDefault(require("./controllers/SubmissionController"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
exports.submissionRouter = (0, express_1.Router)();
const submissionsController = new SubmissionController_1.default();
exports.submissionRouter.get("/", [verifyUser_1.default], (req, res) => submissionsController.get(req, res));
exports.submissionRouter.get("/total_earned", [verifyUser_1.default], (req, res) => submissionsController.getTotalEarned(req, res));
exports.submissionRouter.post("/", (req, res) => submissionsController.post(req, res));
exports.submissionRouter.patch("/", [verifyUser_1.default], (req, res) => submissionsController.update(req, res));
exports.submissionRouter.delete("/", [verifyUser_1.default], (req, res) => submissionsController.delete(req, res));
