"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("./controller/UserController"));
const verifyUser_1 = __importDefault(require("../../middlewares/verifyUser"));
exports.userRouter = (0, express_1.Router)();
const userController = new UserController_1.default();
exports.userRouter.get("/", [verifyUser_1.default], (req, res) => userController.get(req, res));
exports.userRouter.get("/:id", [verifyUser_1.default], (req, res) => userController.getUser(req, res));
exports.userRouter.get('/email/:email', (req, res) => userController.getSafeUserByEmail(req, res));
exports.userRouter.get('/apiKey/:apiKey', (req, res) => userController.getUserByApiKey(req, res));
exports.userRouter.post("/", (req, res) => userController.post(req, res));
exports.userRouter.patch("/", [verifyUser_1.default], (req, res) => userController.update(req, res));
exports.userRouter.delete("/", [verifyUser_1.default], (req, res) => userController.delete(req, res));
