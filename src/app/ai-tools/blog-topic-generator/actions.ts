
"use server";

import { blogTopicGenerator } from "@/ai/flows/blog-topic-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const BlogTopicGeneratorActionSchema = z.object({
  digitalSkills: z.string().min(3, { message: "Please enter at least one digital skill." }),
  userInterests: z.string().min(3, { message: "Please enter at least one user interest." }),
});

type FormState = {
  message: string;
  topics?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateTopics(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = BlogTopicGeneratorActionSchema.safeParse({
    digitalSkills: formData.get("digitalSkills"),
    userInterests: formData.get("userInterests"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        digitalSkills: formData.get("digitalSkills") as string,
        userInterests: formData.get("userInterests") as string,
      }
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
        message: "success",
        topics: result.topics,
      };
    } else {
        return { message: "No topics generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
