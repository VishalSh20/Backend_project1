import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
    username: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    avatar: {
        type: String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    watchHistory : {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    refreshToken:{
        type:String
    }
},
{timestamps:true});

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    this.password = await bcrypt.hash(this.password,10);

    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username:this.username,
        email: this.email,
        fullName : this.fullName
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}
export const User = mongoose.model("User",userSchema);