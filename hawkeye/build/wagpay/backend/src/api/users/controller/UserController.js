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
const client_1 = require("@prisma/client");
class UserController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).send(res.locals.user);
        });
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let userId = Number(req.params.id);
            let user;
            try {
                user = yield this.prisma.user.findFirst({
                    where: {
                        id: userId,
                    },
                });
                res.status(200).send(user);
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            req.body = JSON.parse(req.body);
            let userData = req.body;
            userData.is_paid = false;
            try {
                let user = yield this.prisma.user.create({
                    data: userData,
                });
                res.send(201).send(user);
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
        });
        this.getUserFrom = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = String(req.query["email"]);
            const username = String(req.query["username"]);
            let user;
            try {
                if (email) {
                    user = yield this.prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                    });
                }
                else if (username) {
                    user = yield this.prisma.user.findFirst({
                        where: {
                            username: username,
                        },
                    });
                }
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
            res.status(200).send(user);
            next();
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userBody = JSON.parse(req.body);
            let updatedUser;
            try {
                updatedUser = yield this.prisma.user.update({
                    where: {
                        id: res.locals.user.id,
                    },
                    data: userBody,
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400,
                });
            }
            res.status(201).send(updatedUser);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            let user;
            try {
                user = yield this.prisma.user.delete({
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
            res.status(204).send(user);
        });
    }
}
exports.default = UserController;
