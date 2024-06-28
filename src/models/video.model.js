import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        thumbnail: {
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description: {
            type:String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        duration:{
            type: Number
        },
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        }
    }
,{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video",videoSchema);