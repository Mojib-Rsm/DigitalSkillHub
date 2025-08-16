
"use server";

import { freelanceIdeaGenerator } from "@/ai/flows/freelance-idea-generator";
import { z } from "zod";

const FreelanceIdeaGeneratorActionSchema = z.object({
  skills: z.string().min(3, { message: "Please enter at least one skill." }),
});

type FormState = {
  message: string;
  ideas?: { title: string; description: string }[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateIdeas(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FreelanceIdeaGeneratorActionSchema.safeParse({
    skills: formData.get("skills"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        skills: formData.get("skills") as string,
      }
    };
  }
  
  try {
    const result = await freelanceIdeaGenerator(validatedFields.data);
    if (result.ideas && result.ideas.length > 0) {
      return {
        message: "success",
        ideas: result.ideas,
      };
    } else {
        return { message: "Could not find any ideas. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
