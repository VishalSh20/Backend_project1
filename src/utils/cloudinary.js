import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: "dkyjp97kf",
    api_key: 656153713323734,
    api_secret: "TeKJLRhJ07a5hE7NQUDzO5rPD04"
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(localFilePath) {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        console.log(response);

        fs.unlinkSync(localFilePath);
        return response;
       }  
    }
    catch(error){
        throw error;
    }
}

export {uploadOnCloudinary};