
"use server";

import { bengaliTranslator } from "@/ai/flows/bengali-translator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const BengaliTranslatorActionSchema = z.object({
  textToTranslate: z.string().min(1, { message: "Please enter text to translate." }),
  targetLanguage: z.enum(['English', 'Bengali']),
});

type FormState = {
  message: string;
  translatedText?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function translateText(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = BengaliTranslatorActionSchema.safeParse({
    textToTranslate: formData.get("textToTranslate"),
    targetLanguage: formData.get("targetLanguage"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        textToTranslate: formData.get("textToTranslate") as string,
        targetLanguage: formData.get("targetLanguage") as string,
      }
    };
  }
  
  try {
    const result = await bengaliTranslator(validatedFields.data);
    if (result.translatedText) {
      await saveHistoryAction({
          tool: 'bengali-translator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        translatedText: result.translatedText,
      };
    } else {
        return { message: "Failed to translate text. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
