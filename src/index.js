import dotenv from "dotenv";
dotenv.config()
// require('dotenv').config();
import { connectDB,connectionInstance } from "./db/index.js";
import express from "express";

console.log("Ab connect krunga with",process.env.MONGODB_URI);
connectDB();

const app = express();
app.get('/',(req,res)=>{
    res.send("Server is ready");
})

app.listen(process.env.PORT,()=>{
    console.log("Listening on PORT ",process.env.PORT);
})
