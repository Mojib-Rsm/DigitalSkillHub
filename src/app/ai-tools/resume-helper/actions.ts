
"use server";

import { resumeHelper } from "@/ai/flows/resume-helper";
import { z } from "zod";

const ResumeHelperActionSchema = z.object({
  jobTitle: z.string().min(3, { message: "Please enter a job title." }),
  skills: z.string().min(3, { message: "Please enter at least one skill." }),
  experience: z.string().min(10, { message: "Please describe your experience." }),
});

type FormState = {
  message: string;
  suggestions?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function getSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ResumeHelperActionSchema.safeParse({
    jobTitle: formData.get("jobTitle"),
    skills: formData.get("skills"),
    experience: formData.get("experience"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        jobTitle: formData.get("jobTitle") as string,
        skills: formData.get("skills") as string,
        experience: formData.get("experience") as string,
      }
    };
  }
  
  try {
    const result = await resumeHelper(validatedFields.data);
    if (result.suggestions) {
      return {
        message: "success",
        suggestions: result.suggestions,
      };
    } else {
        return { message: "Failed to generate suggestions. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
