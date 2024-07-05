import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { access } from "fs";

const cookieOptions = {
    secure: true,
    httpOnly: true
};

const generateAccessAndRefreshToken = async(userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return {accessToken,refreshToken};
}

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
});

const loginUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body;
 
    if(!username && !email)
        throw new ApiError(400,"Email or Username is required");
    if(!password)
        throw new ApiError(400,"Password is required")

    const user = await User.findOne({
        $or: [{username} , {email}]
    })
    
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect)
        throw new ApiError(401,"Password is incorrect");

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    if(!accessToken || !refreshToken)
        throw new ApiError(500,"Login Failed");

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    res
    .status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(
         new ApiResponse(
            200,
            "User Logged In Successfully",
          {
            loggedInUser,accessToken,refreshToken
          }
       )
    );

});
   

const logoutUser = asyncHandler(async(req,res)=>{
    
    const user = req.user;
    user.refreshToken = undefined;
    await user.save({validateBeforeSave:false});
    res
    .status(200)
    .clearCookie("accessToken",cookieOptions)
    .clearCookie("refreshToken",cookieOptions)
    .json(
        new ApiResponse(
            200,
            "User logged out"
        )
    )

})

const refreshUser = asyncHandler(async(req,res)=>{
    const {refreshToken} = req.cookie("refreshToken") || req.body?.refreshToken;
    if(!refreshToken)
        throw new ApiError(401,"No Refresh Token");

    const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    if(!decodedToken)
        throw new ApiError(401,"Invalid refresh Token");

    const user = await User.findById(decodedToken._id);
    if(!user)
        throw new ApiError(401,"Invalid refresh token");
    if(user.refreshToken !== refreshToken)
        throw new ApiError(401,"Refresh token is expired or used");

    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    res
    .status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(
            new ApiResponse(
                200,
                "User Refreshed Successfully",
            {
                accessToken,
                refreshToken:newRefreshToken
            }
        )
    )

});

export {
    registerUser,
    loginUser,
    logoutUser
}