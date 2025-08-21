'use server';

import { seedDataFlow } from "@/ai/flows/seed-data";

type FormState = {
  message: string;
  success: boolean;
};

export async function seedDataAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const result = await seedDataFlow();
    return {
      message: result.message,
      success: result.success,
    };
  } catch (error) {
    console.error("Error running seed data flow:", error);
    if (error instanceof Error) {
        return {
            message: `An unexpected error occurred: ${error.message}`,
            success: false,
        };
    }
    return {
        message: "An unknown error occurred during seeding.",
        success: false,
    };
  }
}