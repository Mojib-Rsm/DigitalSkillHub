
"use server";

import { contentOutlineGenerator, ContentOutlineGeneratorOutput } from "@/ai/flows/content-outline-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const ContentOutlineGeneratorActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  contentType: z.string().min(3, { message: "Please select a content type." }),
});

type FormState = {
  message: string;
  outline?: ContentOutlineGeneratorOutput['outline'];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateContentOutline(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ContentOutlineGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    contentType: formData.get("contentType"),
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
    const result = await contentOutlineGenerator(validatedFields.data);
    if (result.outline) {
      await saveHistoryAction({
          tool: 'content-outline-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        outline: result.outline,
      };
    } else {
        return { message: "Failed to generate outline. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
