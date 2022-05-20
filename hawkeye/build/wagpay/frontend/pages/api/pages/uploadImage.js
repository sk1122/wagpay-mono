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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const supabase_1 = require("../../../supabase");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const formidable_1 = __importDefault(require("formidable"));
const create_1 = require("./create");
exports.config = {
    api: {
        bodyParser: false,
    },
};
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = yield (0, verifyUser_1.default)(req, res);
        let { user, error } = yield supabase_1.supabase.auth.api.getUser(req.headers['bearer-token']);
        if (!user) {
            res.status(400).send("Wrong User");
            return;
        }
        const { data: userData, error: userError } = yield supabase_1.supabase
            .from('User')
            .select('*')
            .eq('email', user.email);
        if (!userData || error || userData.length == 0) {
            res.status(400).send("Wrong User");
            return;
        }
        if (req.method === 'POST') {
            const file = req.query['file'];
            const promise = new Promise((resolve, reject) => {
                console.log('form');
                const form = new formidable_1.default.IncomingForm({ multiples: true });
                // console.log(form)
                form.on('file', function (name, file) { console.log(name, file); });
                form.on('error', function (err) { console.log(err); });
                form.on('aborted', function () { });
                form.parse(req, (err, fields, files) => {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const blob = new Blob([new Uint8Array(files.logo)], { type: 'png' });
                        console.log(blob);
                    };
                    // @ts-ignore
                    (0, create_1.uploadFile)(files.logo, file);
                    resolve({ fields, files });
                });
            });
            return promise.then(({ fields, files }) => {
                res.status(200).json({ fields, files });
            });
        }
    });
}
exports.default = create;
