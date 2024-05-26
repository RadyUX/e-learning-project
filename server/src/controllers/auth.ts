import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import asyncHandler from "express-async-handler"
import { errorHandler } from "../utils/error";
import { Prisma, PrismaClient } from "@prisma/client";

import { error } from "console";
const prisma = new PrismaClient()


export const generateToken = (id: number) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is undefined");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };
export const register = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
    const {email, password}  = req.body
    
    //check credentials
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
      } 

      //check user
      const userExist = await prisma.user.findUnique({
        where: { email }
    });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }

    // hash password
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
  
    // create user
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password: hash,
            role: 'learner',
            registrationDate: new Date()
        }
    });
    

    if(newUser){
        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser.id)
        })
    } else{
        res.status(400)
        throw new Error("invalide")
    }
   
}) 
    
   
       