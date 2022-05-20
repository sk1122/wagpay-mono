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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const http_1 = __importDefault(require("http"));
const pubsub_1 = require("@google-cloud/pubsub");
const pubSubClient = new pubsub_1.PubSub();
dotenv.config();
const PORT = parseInt(process.env.PORT) | 5000;
console.log(process.env.PORT, PORT);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    allowedHeaders: ["Content-Type", "bearer-token"],
    origin: ["http://localhost:3000"],
}));
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("gm");
}));
function listenForMessages() {
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    // References an existing subscription
    const subscription = pubSubClient.subscription('wagpay-sub');
    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message) => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;
        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
    }, 5 * 1000);
}
listenForMessages();
server.listen(process.env.PORT, () => {
    console.log(`Server listening @ ${process.env.PORT}`);
});
