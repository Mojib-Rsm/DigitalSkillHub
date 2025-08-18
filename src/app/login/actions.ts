
"use server";

import { z } from "zod";
import { getFirestore, collection, query, where, getDocs } from "firebase-admin/firestore";
import { app } from "@/lib/firebase-admin";
import crypto from "crypto";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

// Helper function to verify password
function verifyPassword(storedPassword: string, providedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':');
    if (!salt || !hash) return false;
    const derivedHash = crypto.pbkdf2Sync(providedPassword, salt, 1000, 64, 'sha512').toString('hex');
    return hash === derivedHash;
}

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      issues: validatedFields.error.flatten().formErrors.formErrors,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  if (!app) {
      console.error("Firebase Admin SDK is not initialized.");
      return { message: "Server configuration error. Please contact support." };
  }

  const db = getFirestore(app);
  const { email, password } = validatedFields.data;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { message: "No user found with this email address." };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.password) {
        return { message: "This account does not have a password set. Please try another login method or reset your password." };
    }

    const isPasswordValid = verifyPassword(userData.password, password);

    if (!isPasswordValid) {
        return { message: "Incorrect password. Please try again." };
    }

    // Password is valid. In a real app, you would create a session here.
    // For this example, we'll just return success.
    // The client-side will handle the redirect.
    console.log(`User ${userData.name} logged in successfully.`);

    return { message: "success" };

  } catch (error: any) {
    console.error("Login Error:", error);
    if (error instanceof Error && error.message.includes('permission-denied')) {
        return { message: "Permission denied. Please check your Firestore security rules." };
    }
    return {
      message: "An unexpected error occurred during login. Please try again.",
    };
  }
}
