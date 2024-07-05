import {config} from "dotenv";
config();
import { app } from "./app.js";
import {connectDB} from "./db/index.js";
import { log } from "console";

connectDB()
.then(
    app.listen(process.env.PORT,(req,res)=>{
        console.log("Server is listening at http://localhost:8000");
    })
)
.catch(() => console.error("Database Connection Failed"))

app.post("/api/v1/check",(req,res)=>res.json(req.body));