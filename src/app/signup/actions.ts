'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SignupSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

type FormState = {
  message: string;
  success: boolean;
  issues?: string[];
  fields?: Record<string, string>;
};

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Validation Error',
      success: false,
      issues: validatedFields.error.errors.map((e) => e.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  const { name, email, password, phone } = validatedFields.data;

  try {
    const db = getFirestore(app);
    const usersCol = collection(db, 'users');

    // Check if user already exists
    const q = query(usersCol, where('email', '==', email));
    const userSnapshot = await getDocs(q);
    if (!userSnapshot.empty) {
      return {
        message: 'A user with this email already exists.',
        success: false,
        issues: ['A user with this email already exists.'],
        fields: { name, email, phone },
      };
    }

    // Create new user
    // WARNING: In a real-world application, never store plaintext passwords.
    // This is a simplified example for this specific environment.
    // Use a library like bcrypt to hash passwords before storing them.
    const userDocRef = await addDoc(usersCol, {
      name,
      email,
      password, // In a real app, this should be a hashed password
      phone,
      createdAt: new Date().toISOString(),
    });

    // Set session cookie
    cookies().set('auth-session', userDocRef.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });

  } catch (error) {
    console.error('Signup action error:', error);
    return {
      message: 'An unexpected server error occurred. Please try again later.',
      success: false,
    };
  }
  
  // Redirect to dashboard on successful signup
  redirect('/dashboard');
}
