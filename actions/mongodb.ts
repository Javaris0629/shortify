"use server"
import Video from "@/models/video"
import Credit from "@/models/credit"
import db from "@/utils/db"
import { currentUser } from "@clerk/nextjs/server"

// save video to DB
export const saveVideoToDatabase = async (data: any) => { 
    try {
      await db()
      
      const user = await currentUser()
      const userEmail = user?.emailAddresses[0].emailAddress 
      const userName = user?.fullName 

      // check if user has enough credits 
      const userCredit = await Credit.findOne({ userEmail })
      if(!userCredit || userCredit.credits < 1) { 
        return { success: false, credits: userCredit?.credits }
      }

      // reduce 1 credit from the user, then save
      userCredit.credits -= 1
      await userCredit.save()

      await new Video({ 
        ...data, 
        userEmail, 
        userName, 
      }).save()

      return { success: true, credits: userCredit.credits }
    } catch (error) {
        console.error(error)
    }
}

// get user videos from DB
export const getUserVideosFromDatabase = async () => { 
    try {
        await db()

        const user = await currentUser()
        const userEmail = user?.emailAddresses[0].emailAddress 
        
        const videos = await Video.find({ userEmail })
        console.log("videos = ", videos)

        return JSON.parse(JSON.stringify(videos))
    } catch (error) {
        console.error(error)
    }
}