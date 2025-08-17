
"use server";

import { videoGenerator } from "@/ai/flows/video-generator";
import { z } from "zod";

const VideoGeneratorActionSchema = z.object({
  prompt: z.string().min(10, { message: "Please enter a more descriptive prompt (at least 10 characters)." }),
});

type FormState = {
  message: string;
  videoUrl?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateVideo(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = VideoGeneratorActionSchema.safeParse({
    prompt: formData.get("prompt"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        prompt: formData.get("prompt") as string,
      }
    };
  }
  
  try {
    const result = await videoGenerator(validatedFields.data);
    if (result.videoUrl) {
      return {
        message: "success",
        videoUrl: result.videoUrl,
      };
    } else {
        return { message: "Failed to generate video. Please try again." }
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        if (error.message.includes("SERVICE_DISABLED") || error.message.includes("Generative Language API has not been used")) {
             return { message: "The required Google API is not enabled. Please enable the 'Generative Language API' in your Google Cloud project and try again." };
        }
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
