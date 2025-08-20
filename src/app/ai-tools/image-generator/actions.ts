
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
  
  try {
    const result = await imageGenerator(validatedFields.data);
    if (result.imageUrl) {
      return {
        message: "success",
        imageUrl: result.imageUrl,
      };
    } else {
        return { message: "Failed to generate image. Please try again." }
    }
  } catch (error) {
    console.error("Image generation action error:", error);
    if (error instanceof Error) {
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
