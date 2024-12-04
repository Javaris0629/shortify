"use server";
import cloudinary from "@/lib/cloudinary";
const textToSpeech = require("@google-cloud/text-to-speech");
import { nanoid } from "nanoid";

export async function generateAudio(text: string) {
  const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // add a short pause at the end of the text
  const textWithPause = text + '. <break time="500ms"/>';

  const request = {
    input: { ssml: `<speak>${textWithPause}</speak>` },
    voice: {
      languageCode: "en-US",
      name: "en-US-Neural2-F",
      ssmlGender: "FEMALE",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  // perform the text to speech request
  const [response] = await client.synthesizeSpeech(request);
  const audioBuffer = response.audioContent;

  // generate a unique id for the audio file
  const fileName = nanoid(6);

  // return a promise to handle cloudinary upload
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(new Error("Upload to cloudinary failed"));
        }

        if (result) {
          console.log(result);
          return resolve({ url: result.secure_url });
        } else {
          return reject(new Error("Upload to cloudinary failed"));
        }
      }
    );

    uploadStream.end(audioBuffer);
  });
}