"use server"
const { GoogleGenerativeAI } = require("@google/generative-ai")

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

if(!apiKey) { 
    throw new Error("KEY IS REQUIRED")
}

const defaultMessage = 
"Create a 5 second long INSPIRATIONAL STORY video script. Include AI imagePrompts in GTA FORMAT for each scene in realistic format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.";

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
})

const generationConfig = { 
    temperature: 1, 
    topP: 0.95, 
    topK: 40, 
    maxOutputTokens: 8192, 
    responseMimeType: "text/plain", 
}

export async function createVideoAi(message: string = defaultMessage) { 
    console.log("createVideoAi message = ", message)
    const chatSession = model.startChat({ 
        generationConfig, 
    })

    const result = await chatSession.sendMessage(message)
    const response = result.response.text()
    const cleanedResponse = response.replace(/```json|\n```/g, "").trim();
    let jsonResponse 

    try {
        jsonResponse = JSON.parse(cleanedResponse)
        console.log(jsonResponse)
        if(jsonResponse) { 
            return { 
                success: true, 
                data: jsonResponse,
            }
        }
    } catch (error) {
        console.error(error)
        return { 
            success: false, 
            data: "", 
        }   
    }
}