
"use server";

import { contentOutlineGenerator, ContentOutlineGeneratorOutput } from "@/ai/flows/content-outline-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const ContentOutlineGeneratorActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  contentType: z.string().min(3, { message: "Please select a content type." }),
});

export async function generateContentOutlineAction(
  formData: FormData
): Promise<{ success: boolean; data?: ContentOutlineGeneratorOutput; issues?: z.ZodIssue[]; fields?: Record<string, string>}> {
  const validatedFields = ContentOutlineGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    contentType: formData.get("contentType"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors,
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
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: [{ path: ['root'], message: "Failed to generate outline. Please try again."}] };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: [{ path: ['root'], message: "An unexpected error occurred. Please try again."}],
    };
  }
}
