import dotenv from "dotenv";
dotenv.config();  // require('dotenv').config();

import {connectDB} from "./db/index.js";

connectDB();

