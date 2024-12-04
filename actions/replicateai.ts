"use server";

import Replicate from "replicate";
// import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import fetch from "node-fetch";
import cloudinary from "@/lib/cloudinary";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export async function generateImageAi(imagePrompt: string) {
  try {
    // 1. generate image using replicate ai
    const input = {
      prompt: imagePrompt,
      output_format: "url",
      output_quality: 80,
      aspect_ratio: "1:1",
    };

    const output: any = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );
    // console.log(output);
    const imageUrl = output[0];

    // 2. fetch the image data from generated image url
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. upload the image to cloudinary using buffer
    const uploadResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ai_video_images_udemy", //chan
            public_id: nanoid(),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    // 4. return the cloudinary url of the uploaded image
    const cloudinaryUrl = uploadResponse.secure_url;
    console.log("cloudinary image =>", cloudinaryUrl);
    return cloudinaryUrl;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
}
