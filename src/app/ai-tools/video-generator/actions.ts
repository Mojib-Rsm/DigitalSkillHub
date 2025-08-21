
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
  
  let result;
  try {
    result = await videoGenerator(validatedFields.data);
  } catch (error) {
    console.error("Error in generateVideo action:", error);
    if (error instanceof Error) {
        if (error.message.includes("SERVICE_DISABLED") || error.message.includes("Generative Language API has not been used")) {
             return { message: "প্রয়োজনীয় Google API সক্রিয় করা নেই। অনুগ্রহ করে আপনার Google Cloud প্রকল্পে 'Generative Language API' সক্রিয় করুন এবং আবার চেষ্টা করুন।" };
        }
        if (error.message.includes('429') || error.message.includes('503') || error.message.toLowerCase().includes('rate limit')) {
            return { message: "ভিডিও জেনারেটর পরিষেবাটি বর্তমানে উচ্চ চাহিদার কারণে ওভারলোড হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
        }
        return { message: `একটি অপ্রত্যাশিত ত্রুটি ঘটেছে: ${error.message}` };
    }
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
  
  if (result.videoUrl) {
    return {
        message: "success",
        videoUrl: result.videoUrl,
    };
  } else {
      return { message: "ভিডিও তৈরি করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।" }
  }
}
