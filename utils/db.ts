import mongoose from 'mongoose'

export default async function db() { 
    if(mongoose.connection.readyState >= 1) return 

    try {
        await mongoose.connect(process.env.DATABASE as string)
    } catch (error) {
        console.log(error)
    }
}