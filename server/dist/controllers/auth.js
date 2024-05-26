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
exports.register = exports.generateToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is undefined");
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
exports.generateToken = generateToken;
exports.register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //check credentials
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }
    //check user
    const userExist = yield prisma.user.findUnique({
        where: { email }
    });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }
    // hash password
    const salt = bcryptjs_1.default.genSaltSync(20);
    const hash = bcryptjs_1.default.hashSync(password, salt);
    // create user
    const newUser = yield prisma.user.create({
        data: Object.assign(Object.assign({}, req.body), { password: hash, role: 'learner' })
    });
    if (newUser) {
        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            token: (0, exports.generateToken)(newUser.id)
        });
    }
    else {
        res.status(400);
        throw new Error("invalide");
    }
}));
