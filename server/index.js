import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import router from './routes/Routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use("/api", router);

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("database connected");
    app.listen(process.env.PORT,()=>{
        console.log("Server running at port: "+process.env.PORT);
    });
}).catch((c)=>{
    console.log("database connection error",c);
});
