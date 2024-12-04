import mongoose from 'mongoose'

const creditsSchema = new mongoose.Schema( 
    { 
        userEmail: { 
            type: String, 
            required: true, 
            index: true 
        }, 
        credits: Number, 
        amount: Number 
    }, 
    { timestamps: true }
)

const Credit = mongoose.models.Credit || mongoose.model("Credit", creditsSchema)

export default Credit