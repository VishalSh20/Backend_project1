import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Corrected the import statement
import bodyParser from "body-parser"; // Move this import to the top

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(bodyParser.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
import userRouter from "./routes/user.route.js";

// Configure routes
app.use("/api/v1/users", userRouter);

export { app };
