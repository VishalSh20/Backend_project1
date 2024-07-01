import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req,res) => {
    const {username ,email ,password, fullName} = req.body;

    if([username ,email ,password, fullName].map((val)=>Boolean(val)).includes(false))
        throw new ApiError(400,"All fields are required");

    const userExisted = await User.findOne({
       $or:[ {username:username} , {email:email}]
    })
   
    if(userExisted)
        throw new ApiError(409,"User already exists");
    
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(avatarLocalPath,coverImageLocalPath);
    
    if(!avatarLocalPath)
        throw new ApiError(400,"Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.create({
        username,
        password,
        email,
        fullName,
        avatar : avatar.url,
        coverImage : coverImage.url
    })
    
    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser)
        throw new Error(500,"Something went wrong in registration");

    res.status(201).send(new ApiResponse(201,"User Registered successfully",createdUser));
})

export {registerUser}