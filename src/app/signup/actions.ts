
'use server'

import { z } from 'zod';
import { registerUser } from '@/services/user-service';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

const SignupFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  userType: z.string().min(1, { message: 'Please select a user type.' }),
  terms: z.literal('on', {
    errorMap: () => ({ message: 'You must accept the terms and conditions.' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


export type FormState = {
  message: string;
  issues?: z.ZodError['formErrors']['fieldErrors'];
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
        userType: formData.get('userType') as string,
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
     if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      return { message: `Sign-in after registration failed: ${error.message}` };
    }
    return { message: 'An unknown error occurred during sign-in.' };
  }

  // This part should not be reached if signIn is successful with a redirect
  return { message: 'success' };
}
