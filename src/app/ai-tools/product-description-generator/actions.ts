
"use server";

import { productDescriptionGenerator } from "@/ai/flows/product-description-generator";
import { z } from "zod";

const ProductDescriptionGeneratorActionSchema = z.object({
  productName: z.string().min(3, { message: "Please enter a product name." }),
  productFeatures: z.string().min(10, { message: "Please enter at least one feature." }),
  targetAudience: z.string().min(3, { message: "Please describe the target audience." }),
});

type FormState = {
  message: string;
  description?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateDescription(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ProductDescriptionGeneratorActionSchema.safeParse({
    productName: formData.get("productName"),
    productFeatures: formData.get("productFeatures"),
    targetAudience: formData.get("targetAudience"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        productName: formData.get("productName") as string,
        productFeatures: formData.get("productFeatures") as string,
        targetAudience: formData.get("targetAudience") as string,
      }
    };
  }
  
  try {
    const result = await productDescriptionGenerator(validatedFields.data);
    if (result.description) {
      return {
        message: "success",
        description: result.description,
      };
    } else {
        return { message: "Failed to generate description. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
