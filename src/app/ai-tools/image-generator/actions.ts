
"use server";

import { imageGenerator } from "@/ai/flows/image-generator";
import { z } from "zod";

const ImageGeneratorActionSchema = z.object({
  prompt: z.string().min(10, { message: "Please enter a more descriptive prompt (at least 10 characters)." }),
});

type FormState = {
  message: string;
  imageUrl?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateImage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const validatedFields = ImageGeneratorActionSchema.safeParse({
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
    result = await imageGenerator(validatedFields.data);
  } catch (error) {
    console.error("Image generation action error:", error);
    if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('503') || error.message.toLowerCase().includes('rate limit')) {
            return { message: "The image generation service is currently overloaded due to high demand. Please try again in a few moments." };
        }
        return { message: `ছবি তৈরি করতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে কয়েক মিনিট পর আবার চেষ্টা করুন। (${error.message})` };
    }
    return {
      message: "ছবি তৈরি করতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে কয়েক মিনিট পর আবার চেষ্টা করুন।",
    };
  }
  
  if (result.imageUrl) {
    return {
      message: "success",
      imageUrl: result.imageUrl,
    };
  } else {
      return { message: "Failed to generate image. The model did not return an image URL." }
  }
}
