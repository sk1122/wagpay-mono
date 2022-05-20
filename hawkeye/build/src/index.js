"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const http_1 = __importDefault(require("http"));
const router_1 = require("./api/pages/router");
const router_2 = require("./api/users/router");
const router_3 = require("./api/submissions/router");
const router_4 = require("./api/payment_intent/router");
const routes_1 = require("./api/products/routes");
const router_5 = require("./api/invoices/router");
const client_1 = require("@prisma/client");
dotenv.config();
exports.prisma = new client_1.PrismaClient();
const PORT = parseInt(process.env.PORT) | 5000;
console.log(process.env.PORT, PORT);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.static('files'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    allowedHeaders: ["Content-Type", "bearer-token", "api_key"],
    origin: ["http://localhost:3000", "https://wagpay.xyz"],
}));
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("gm");
}));
app.use("/api/pages/", router_1.pageRouter);
app.use("/api/submissions/", router_3.submissionRouter);
app.use("/api/paymentIntents/", router_4.paymentIntentRouter);
app.use("/api/user/", router_2.userRouter);
app.use("/api/products/", routes_1.productRouter);
app.use("/api/invoices/", router_5.invoiceRouter);
server.listen(process.env.PORT, () => {
    console.log(`Server listening @ ${process.env.PORT}`);
});
