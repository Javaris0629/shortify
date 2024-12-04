import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema( 
    { 
        userEmail: { type: String, required: true }, 
        userName: String, 
        videoScript: Array, 
        images: Array, 
        audioUrl: String, 
        captions: Array, 
    }, 
    { timestamps: true }
)

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema)

export default Video 