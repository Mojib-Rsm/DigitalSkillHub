
"use server";

import { quizGenerator } from "@/ai/flows/quiz-generator";
import { z } from "zod";

const QuizGeneratorActionSchema = z.object({
  text: z.string().min(50, { message: "Please enter at least 50 characters of text." }),
  numQuestions: z.coerce.number().min(1).max(10),
});

type FormState = {
  message: string;
  questions?: { question: string; options: string[]; answer: string }[];
  fields?: Record<string, string | number>;
  issues?: string[];
};

export async function generateQuiz(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = QuizGeneratorActionSchema.safeParse({
    text: formData.get("text"),
    numQuestions: formData.get("numQuestions"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        text: formData.get("text") as string,
        numQuestions: Number(formData.get("numQuestions")),
      }
    };
  }
  
  try {
    const result = await quizGenerator(validatedFields.data);
    if (result.questions && result.questions.length > 0) {
      return {
        message: "success",
        questions: result.questions,
      };
    } else {
        return { message: "Failed to generate quiz. Please try a different text." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
