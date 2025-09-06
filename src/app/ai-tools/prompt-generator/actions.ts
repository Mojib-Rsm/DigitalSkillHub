
"use server";

import { promptGenerator, PromptGeneratorInput, PromptGeneratorOutput } from "@/ai/flows/prompt-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PromptGeneratorActionSchema = z.object({
  topic: z.string().optional(),
  mediaType: z.enum(['Image', 'Video', 'Audio'], { errorMap: () => ({ message: 'Please select a media type.'})}),
  language: z.enum(['Bengali', 'English'], { errorMap: () => ({ message: 'Please select a language.'})}),
  photo: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Image size must be less than 4MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    ).optional(),
}).refine(data => {
    return data.topic || (data.photo && data.photo.size > 0);
}, {
    message: "Please provide either a topic or an image.",
    path: ["topic"], 
});


export async function generatePromptAction(
  formData: FormData
): Promise<{ success: boolean; data?: PromptGeneratorOutput; issues?: z.ZodIssue[] }> {
  const validatedFields = PromptGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    mediaType: formData.get("mediaType"),
    language: formData.get("language"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors,
    };
  }
  
  try {
    const { topic, mediaType, language, photo } = validatedFields.data;

    let photoDataUri;
    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;
    }

    const flowInput: PromptGeneratorInput = { topic, photoDataUri, mediaType, language };
    const result = await promptGenerator(flowInput);

    if (result.shortPrompts || result.longPrompts) {
      await saveHistoryAction({
          tool: 'prompt-generator',
          input: { topic, mediaType, language, has_image: !!photoDataUri },
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: [{ path: ["root"], message: "Failed to generate prompts. Please try again."}] };
    }
  } catch (error) {
    console.error(error);
     return {
      success: false,
      issues: [{ path: ["root"], message: "An unexpected error occurred. Please try again."}],
    };
  }
}
