import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1] || req.body?.accessToken;
    if(!token)
        throw new ApiError(401,"Unauthorised access");

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(!decodedToken)
        throw new ApiError(401,"Access Token is not valid");

    const user = await User.findById(decodedToken._id);
    if(!user)
        throw new ApiError(401,"Access Token is not valid or expired");

    req.user = user;
    next();
    
})