
"use server";

import { blogTopicGenerator, BlogTopicGeneratorOutput } from "@/ai/flows/blog-topic-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const BlogTopicGeneratorActionSchema = z.object({
  digitalSkills: z.string().min(3, { message: "Please enter at least one digital skill." }),
  userInterests: z.string().min(3, { message: "Please enter at least one user interest." }),
});

type BlogTopicGeneratorInput = z.infer<typeof BlogTopicGeneratorActionSchema>;

export async function generateTopicsAction(
  input: BlogTopicGeneratorInput
): Promise<{ success: boolean; data?: BlogTopicGeneratorOutput; issues?: string[] }> {
  const validatedFields = BlogTopicGeneratorActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors.map((e) => e.message),
    };
  }
  
  try {
    const result = await blogTopicGenerator(validatedFields.data);
    if (result.topics && result.topics.length > 0) {
      await saveHistoryAction({
        tool: 'blog-topic-generator',
        input: validatedFields.data,
        output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["No topics generated. Please try a different input."] }
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      success: false,
      issues: [errorMessage],
    };
  }
}
