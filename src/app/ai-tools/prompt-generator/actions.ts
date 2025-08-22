
"use server";

import { promptGenerator, PromptGeneratorOutput } from "@/ai/flows/prompt-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const PromptGeneratorActionSchema = z.object({
  topic: z.string().min(10, { message: "Please enter a topic with at least 10 characters." }),
  mediaType: z.enum(['Image', 'Video', 'Audio'], { errorMap: () => ({ message: 'Please select a media type.'})}),
  language: z.enum(['Bengali', 'English'], { errorMap: () => ({ message: 'Please select a language.'})}),
});

type FormState = {
  message: string;
  prompts?: PromptGeneratorOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generatePromptAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PromptGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    mediaType: formData.get("mediaType"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await promptGenerator(validatedFields.data);
    if (result.shortPrompts || result.longPrompts) {
      await saveHistoryAction({
          tool: 'prompt-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        prompts: result,
      };
    } else {
        return { message: "Failed to generate prompts. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
