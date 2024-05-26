import { PrismaClient } from "@prisma/client";
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import authRouter from './routes/auth';

const app: Express = express();
dotenv.config();

const prisma = new PrismaClient()


app.use(express.json());
app.use("/auth", authRouter);



const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
  }); 

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


