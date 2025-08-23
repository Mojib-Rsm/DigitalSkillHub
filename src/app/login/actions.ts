
'use server';

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
  let userSnapshot;

  try {
    const db = getFirestore(app);
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('email', '==', email));
    userSnapshot = await getDocs(q);

  } catch (error) {
    console.error('Firestore connection error during login:', error);
    return {
      message: 'Could not connect to the database. Please check your network and try again.',
      success: false,
    };
  }

  if (userSnapshot.empty) {
    return { message: 'No user found with this email.', success: false };
  }

  const userData = userSnapshot.docs[0].data();
  const userId = userSnapshot.docs[0].id;
  
  // WARNING: In a real-world application, never store or compare plaintext passwords.
  // This is a simplified example for this specific environment.
  // Use a library like bcrypt to hash passwords during registration and compare them during login.
  const isPasswordValid = userData.password === password;

  if (!isPasswordValid) {
    return { message: 'Invalid password. Please try again.', success: false };
  }

  // In a real app, you would generate a secure JWT. For this demo, we'll use the user ID.
  cookies().set('auth-session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
  });

  redirect('/dashboard');
}
