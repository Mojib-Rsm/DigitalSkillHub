
"use server";

import { imageEditor, ImageEditorOutput } from "@/ai/flows/image-editor";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ImageEditorActionSchema = z.object({
  prompt: z.string().min(10, { message: "Please enter a more descriptive prompt (at least 10 characters)." }),
  photo: z
    .any()
    .refine((file) => file?.size > 0, 'Please upload an image.')
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Image size must be less than 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    ),
});


export async function editImageAction(
  formData: FormData
): Promise<{ success: boolean; data?: ImageEditorOutput; issues?: z.ZodIssue[]}> {
  const validatedFields = ImageEditorActionSchema.safeParse({
    prompt: formData.get("prompt"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors,
    };
  }
  
  try {
    const { prompt, photo } = validatedFields.data;
    
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;

    const flowInput = { prompt, photoDataUri };
    const result = await imageEditor(flowInput);

    if (result.imageUrl) {
      await saveHistoryAction({
          tool: 'image-editor',
          input: { prompt }, // Don't save the large image URI in history
          output: result,
      });
      return {
        success: true,
        data: result
      };
    } else {
        throw new Error("No image was generated. Please try a different image or prompt.");
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      success: false,
      issues: [{
        path: ["root"],
        message: errorMessage
      }]
    };
  }
}
