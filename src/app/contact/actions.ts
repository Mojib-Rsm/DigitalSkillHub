
"use server";

import { contactSupportFlow } from "@/ai/flows/contact-support";
import { z } from "zod";

const ContactSupportSchema = z.object({
  name: z.string().min(3, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Please enter a subject." }),
  message: z.string().min(10, { message: "Please enter a message." }),
});

type FormState = {
  message: string;
  reply?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function contactSupportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ContactSupportSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
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
    const result = await contactSupportFlow(validatedFields.data);
    if (result.reply) {
      return {
        message: "success",
        reply: result.reply,
      };
    } else {
        return { message: "Failed to process your request. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
