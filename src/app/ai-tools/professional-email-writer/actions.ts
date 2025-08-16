
"use server";

import { professionalEmailWriter } from "@/ai/flows/professional-email-writer";
import { z } from "zod";

const ProfessionalEmailWriterActionSchema = z.object({
  recipient: z.string().min(3, { message: "Please enter the recipient's name or role." }),
  purpose: z.string().min(10, { message: "Please describe the purpose of the email." }),
  tone: z.string().min(1, { message: "Please select a tone." }),
});

type FormState = {
  message: string;
  emailDraft?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function writeEmail(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ProfessionalEmailWriterActionSchema.safeParse({
    recipient: formData.get("recipient"),
    purpose: formData.get("purpose"),
    tone: formData.get("tone"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        recipient: formData.get("recipient") as string,
        purpose: formData.get("purpose") as string,
        tone: formData.get("tone") as string,
      }
    };
  }
  
  try {
    const result = await professionalEmailWriter(validatedFields.data);
    if (result.emailDraft) {
      return {
        message: "success",
        emailDraft: result.emailDraft,
      };
    } else {
        return { message: "Failed to write email. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
