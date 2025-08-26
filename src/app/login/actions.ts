
'use server';

import 'dotenv/config';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { redirect } from 'next/navigation';


const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});


type FormState = {
  message: string;
  success: boolean;
};

export async function loginAction(
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = LoginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data. Please check your inputs.',
        success: false,
      };
    }

    const { email, password } = validatedFields.data;
    const db = getFirestore(app);
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', email));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      return { message: 'No user found with this email.', success: false };
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;
    
    const isPasswordValid = userData.password === password;

    if (!isPasswordValid) {
      return { message: 'Invalid password. Please try again.', success: false };
    }

    cookies().set('auth-session', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });

    return { message: 'Login successful!', success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in loginAction:', errorMessage);
    // Return the detailed error message to the client for debugging
    return {
      message: `Server Error: ${errorMessage}`,
      success: false,
    };
  }
}
