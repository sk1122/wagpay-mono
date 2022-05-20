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
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // await prisma.user.create({
        //  data: users[0],
        //});
        // await prisma.pages.createMany({
        // data: pages,
        // });
        // await prisma.product.createMany({
        // data: products,
        // });
        // await prisma.submission.createMany({
        // data: submission,
        //});
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
// {
//   "embeds": [
//     {
//       "title": "Your store has been created",
//       "description": "its not good tho",
//       "color": 16763904
//     },
//     {
//       "title": "You received a order from ray6969@69.69",
//       "description": "don't get too happy, just $0.1",
//       "color": 16763904,
//       "fields": [
//         {
//           "name": "Product 1",
//           "value": "Don't sell drugs on our platform"
//         },
//         {
//           "name": "ray69",
//           "value": "Why sell your username??"
//         },
//         {
//           "name": "v3n0m",
//           "value": "x"
//         }
//       ]
//     }
//   ]
// }
