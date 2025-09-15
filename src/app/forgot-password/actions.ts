
'use server';

import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormState = {
  success: boolean;
  message: string;
};

// This is a placeholder action. In a real application, you would:
// 1. Generate a secure, unique, and expiring token.
// 2. Store the token hash in your database, associated with the user's account.
// 3. Send an email to the user with a link containing the token (e.g., /reset-password?token=...).
export async function forgotPasswordAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map(e => e.message).join(', '),
    };
  }

  const { email } = validatedFields.data;

  // --- Placeholder Logic ---
  // In a real app, you would check if the user exists and send an email.
  // For this demo, we'll just simulate a success response.
  console.log(`Password reset requested for: ${email}`);

  return {
    success: true,
    message: `If an account with the email ${email} exists, a password reset link has been sent.`,
  };
}
