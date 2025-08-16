
"use server";

import { interviewQuestionPractice } from "@/ai/flows/interview-question-practice";
import { z } from "zod";

const InterviewQuestionPracticeActionSchema = z.object({
  jobTitle: z.string().min(3, { message: "Please enter a job title." }),
  experienceLevel: z.string().min(1, { message: "Please select an experience level." }),
});

type FormState = {
  message: string;
  questions?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateQuestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = InterviewQuestionPracticeActionSchema.safeParse({
    jobTitle: formData.get("jobTitle"),
    experienceLevel: formData.get("experienceLevel"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        jobTitle: formData.get("jobTitle") as string,
        experienceLevel: formData.get("experienceLevel") as string,
      }
    };
  }
  
  try {
    const result = await interviewQuestionPractice(validatedFields.data);
    if (result.questions && result.questions.length > 0) {
      return {
        message: "success",
        questions: result.questions,
      };
    } else {
        return { message: "No questions generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

