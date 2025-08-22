
"use server";

import { priceRateCalculator } from "@/ai/flows/price-rate-calculator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const PriceRateCalculatorActionSchema = z.object({
  projectType: z.string().min(3, { message: "Please enter a project type." }),
  complexity: z.enum(['Low', 'Medium', 'High'], { errorMap: () => ({ message: 'Please select a complexity level.' })}),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Expert'], { errorMap: () => ({ message: 'Please select an experience level.' })}),
});

type FormState = {
  message: string;
  priceRange?: string;
  justification?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function calculatePrice(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PriceRateCalculatorActionSchema.safeParse({
    projectType: formData.get("projectType"),
    complexity: formData.get("complexity"),
    experienceLevel: formData.get("experienceLevel"),
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
    const result = await priceRateCalculator(validatedFields.data);
    if (result.priceRange && result.justification) {
      await saveHistoryAction({
          tool: 'price-rate-calculator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        priceRange: result.priceRange,
        justification: result.justification,
      };
    } else {
        return { message: "Failed to calculate price. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
