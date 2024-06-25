import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected With DB with host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("DB Connection Failed! Reason: ",error);
        throw error
    }
}

export {connectionInstance,connectDB};