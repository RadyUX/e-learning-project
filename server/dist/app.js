"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
app.use(body_parser_1.default.json());
app.use("/api/auth", auth_1.default);
/*async function main(){
    const user = await prisma.user.create({
        data: {
            email: 'rafaele.sinaguglia@gmail.com',
            password: 'lol',
            role: 'admin',
            registrationDate: new Date(),
            learning_rank: 'avancé'
        }
    })
    console.log(user)
}

main().catch(async (e)=>{
    console.error(e)
    process.exit(1)
}).finally(async()=>{
    await prisma.$disconnect()
})*/
exports.default = app;
