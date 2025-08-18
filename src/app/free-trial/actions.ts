
"use server";

import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }

  // TODO: Implement actual user creation logic (e.g., save to database)
  console.log("New user signed up:", validatedFields.data.name, validatedFields.data.email);

  // For now, we'll just return a success message
  return {
    message: "success",
  };
}
