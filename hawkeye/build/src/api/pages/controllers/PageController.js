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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fetch, { BodyInit } from "node-fetch";
const index_1 = require("../../../index");
function isNumeric(str) {
    if (typeof str != "string")
        return false; // we only process strings!  
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}
class PageController {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = {};
            Object.keys(req.query).map(value => { if (isNumeric(req.query[value]) && value !== 'cursor')
                data[value] = Number(req.query[value]); });
            let db_query = Object.assign({ userId: res.locals.user.id }, data);
            var pages = [];
            try {
                pages = yield index_1.prisma.pages.findMany({
                    take: 20,
                    skip: 1,
                    cursor: {
                        id: Number(req.query.cursor)
                    },
                    where: db_query,
                    orderBy: {
                        created_at: 'desc'
                    }
                });
            }
            catch (e) {
                pages = yield index_1.prisma.pages.findMany({
                    take: 20,
                    where: db_query,
                    orderBy: {
                        created_at: 'desc'
                    }
                });
            }
            const return_data = {
                data: pages,
                cursor: 0
            };
            res.status(200).send(return_data);
        });
        this.getTotalVisits = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const visits = yield index_1.prisma.pages.aggregate({
                _sum: {
                    visits: true
                },
                where: {
                    userId: res.locals.user.id
                }
            });
            if (!visits) {
                res.status(400).send({
                    error: "You don't have any stores",
                    status: 400
                });
                return;
            }
            res.status(200).send(visits);
        });
        this.getFromSlug = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { slug, username } = req.query;
            var page;
            try {
                page = yield index_1.prisma.pages.findFirst({
                    include: {
                        products: true
                    },
                    where: {
                        user: {
                            username: username
                        },
                        slug: slug
                    }
                });
                console.log(page);
            }
            catch (e) {
                console.log(e);
                res.status(400).send({
                    error: e,
                    status: 401
                });
                return;
            }
            console.log(page);
            res.status(200).send(page);
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let _a = req.body, { products } = _a, pageData = __rest(_a, ["products"]);
            pageData.userId = res.locals.user.id;
            for (let i = 0; i < products.create.length; i++) {
                products.create[i].userId = res.locals.user.id;
                console.log(products.create[i].userId, "user");
            }
            pageData.products = products;
            if (!pageData.eth_address)
                pageData.eth_address = res.locals.user.eth_address;
            if (!pageData.sol_address)
                pageData.sol_address = res.locals.user.sol_address;
            try {
                const slug = yield index_1.prisma.pages.findFirst({
                    where: {
                        userId: res.locals.user.id,
                        slug: pageData.slug
                    }
                });
                console.log(slug, pageData.slug, "SLUG");
                if (slug) {
                    res.status(400).send({ error: 'Store already exists with that slug', status: 400 });
                    return;
                }
            }
            catch (e) { }
            var page;
            try {
                page = yield index_1.prisma.pages.create({
                    data: pageData
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(page);
        });
        this.batch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const pageData = req.body;
            var pages;
            try {
                pages = yield index_1.prisma.pages.createMany({
                    data: pageData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(201).send(pages);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = req.body, { id } = _b, pageData = __rest(_b, ["id"]);
            if (Object.keys(pageData).includes('slug')) {
                try {
                    const slug = yield index_1.prisma.pages.findFirst({
                        where: {
                            userId: res.locals.user.id,
                            slug: pageData.slug
                        }
                    });
                    if (slug) {
                        res.status(400).send({ error: 'Store already exists with that slug', status: 400 });
                        return;
                    }
                }
                catch (e) { }
            }
            var page;
            try {
                page = yield index_1.prisma.pages.update({
                    where: {
                        id: id
                    },
                    data: pageData
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(200).send(page);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            var page;
            try {
                page = yield index_1.prisma.pages.delete({
                    where: {
                        id: Number(id)
                    }
                });
            }
            catch (e) {
                res.status(400).send({
                    error: e,
                    status: 400
                });
                return;
            }
            res.status(204).send(page);
        });
    }
}
exports.default = PageController;
