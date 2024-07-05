import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import {cloudinaryConfig} from "../config/cloudinary.config.js"

cloudinary.config(cloudinaryConfig);

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(localFilePath) {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        console.log(response);

        fs.unlinkSync(localFilePath);
        return response
       }  
    }
    catch(error){
        throw error;
    }
}

export {uploadOnCloudinary};