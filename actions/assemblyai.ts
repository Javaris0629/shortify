"use server";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY!,
});

export async function generateCaptions(audioFileUrl: string) {
  try {
    const data = {
      audio_url: audioFileUrl,
    };

    const transcript: any = await client.transcripts.transcribe(data);
    console.log(transcript.words);
    return transcript.words;
    // return captionsArray;
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
}
