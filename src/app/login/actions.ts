
"use server";

import { z } from "zod";
import { getFirestore, doc, setDoc } from "firebase/firestore/lite";
import { app } from "@/lib/firebase-admin";

const LoginSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  idToken: z.string(),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid data provided.",
      issues: validatedFields.error.flatten().fieldErrors.idToken,
    };
  }
  
  if (!app) {
      console.error("Firebase Admin SDK is not initialized.");
      return { message: "Server configuration error. Please contact support." };
  }

  const db = getFirestore(app);

  const { uid, email, name } = validatedFields.data;

  try {
    // Add or update user in Firestore. `merge: true` creates the doc if it doesn't exist.
    await setDoc(doc(db, "users", uid), {
      email,
      name: name || email.split('@')[0],
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    return { message: "success" };

  } catch (error: any) {
    console.error("Firestore Error:", error);
     if (error instanceof Error && error.message.includes('permission-denied')) {
        return { message: "Permission denied. Please check your Firestore security rules." };
    }
    return {
      message: "Failed to save user data. Please try again.",
    };
  }
}
