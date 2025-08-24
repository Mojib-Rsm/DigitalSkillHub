
"use server";

import { coverLetterGenerator } from "@/ai/flows/cover-letter-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const CoverLetterGeneratorActionSchema = z.object({
  jobTitle: z.string().min(3, { message: "Please enter a job title." }),
  companyName: z.string().min(2, { message: "Please enter a company name." }),
  userSkills: z.string().min(10, { message: "Please enter at least one skill." }),
  userExperience: z.string().min(20, { message: "Please briefly describe your experience." }),
});

type FormState = {
  message: string;
  coverLetter?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateCoverLetter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = CoverLetterGeneratorActionSchema.safeParse({
    jobTitle: formData.get("jobTitle"),
    companyName: formData.get("companyName"),
    userSkills: formData.get("userSkills"),
    userExperience: formData.get("userExperience"),
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
    const result = await coverLetterGenerator(validatedFields.data);
    if (result.coverLetter) {
      await saveHistoryAction({
          tool: 'cover-letter-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        coverLetter: result.coverLetter,
        fields: validatedFields.data,
      };
    } else {
        return { message: "Failed to generate cover letter. Please try again.", fields: validatedFields.data }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
       fields: validatedFields.data,
    };
  }
}
