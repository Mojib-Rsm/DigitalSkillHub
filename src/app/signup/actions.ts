
'use server'

import { z } from 'zod';
import { registerUser } from '@/services/user-service';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

const SignupFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type FormState = {
  message: string;
  issues?: string[];
  fields?: Record<string, string>;
};

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Validation Error',
      issues: validatedFields.error.flatten().fieldErrors,
      fields: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
      },
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await registerUser({ name, email, password });
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('Duplicate entry')) {
            return { message: 'An account with this email already exists.' };
        }
        return { message: `Registration failed: ${error.message}` };
    }
    return { message: 'An unknown error occurred during registration.' };
  }
  
  // After successful registration, sign the user in
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    // This might happen if there's a problem with the sign-in process after registration
    console.error('Sign-in after registration failed:', error);
    // Redirect to login as a fallback
    redirect('/login');
  }

  // This part should not be reached if signIn is successful with a redirect
  return { message: 'success' };
}
