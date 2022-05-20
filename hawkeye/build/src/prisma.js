"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaDB {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
}
exports.default = PrismaDB;
