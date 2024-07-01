import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();  // require('dotenv').config();

import {connectDB} from "./db/index.js";

connectDB()
.then(
    app.listen(process.env.PORT,(req,res)=>{
        console.log("Server is listening at http://localhost:8000");
    })
)
.catch(() => console.error("Database Connection Failed"))

