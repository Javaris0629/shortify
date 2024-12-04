"use server";
import Credit from "@/models/credit";
import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const saveCreditToDb = async (amount: number, credits: number) => { 
    try {
        await db()

        const user = await currentUser() 
        const userEmail = user?.emailAddresses[0].emailAddress

        // check if user already has a credit record 
        const existingCredit = await Credit.findOne({ userEmail }) 

        if(existingCredit) { 
            existingCredit.amount += amount // add new amount of credits to existing amount
            existingCredit.credits += credits
            await existingCredit.save()

            return JSON.parse(JSON.stringify(existingCredit))
        } else { 
            const newCredit = new Credit({ 
                userEmail, 
                amount, 
                credits,
            })

            await newCredit.save()
            return JSON.parse(JSON.stringify(newCredit))
        }
    } catch (err) {
        console.error(err)
    } 
}

export const getUserCreditsDb = async () => { 
    try {
        const user = await currentUser()
        const userEmail = user?.emailAddresses[0].emailAddress

        const credit = await Credit.findOne({ userEmail })
        return JSON.parse(JSON.stringify(credit))
    } catch (error) {
        console.error(error)
    }
}

export const checkCreditRecordDb = async () => { 
    try {
        await db()

        const user = await currentUser()
        const userEmail = user?.emailAddresses[0].emailAddress

        const credit = await Credit.findOne({ userEmail })

        if(!credit) { 
            const newCredit = new Credit({ 
                userEmail, 
                amount: 0, 
                credits: 5, 
            }) 

            await newCredit.save()
            return JSON.parse(JSON.stringify(newCredit))
        }
    } catch (err: any) {
        throw new Error()
    }
}