
"use server";

import { z } from "zod";
import admin from 'firebase-admin';
import crypto from "crypto";
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from "@/../service-account.json";

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e: any) {
        if (e.code === 'invalid-credential') {
            console.error("Firebase Admin SDK initialization failed: The service account credentials in service-account.json are not valid. Please check your configuration.");
        } else {
            console.error("Firebase Admin SDK initialization failed:", e.message);
        }
    }
}


const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
  customToken?: string;
};

// Helper function to verify password
function verifyPassword(storedPassword: string, providedPassword: string): boolean {
    try {
        const [salt, hash] = storedPassword.split(':');
        if (!salt || !hash) return false;
        const derivedHash = crypto.pbkdf2Sync(providedPassword, salt, 1000, 64, 'sha512').toString('hex');
        return hash === derivedHash;
    } catch (e) {
        console.error("Error verifying password:", e);
        return false;
    }
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
      issues: validatedFields.error.flatten().formErrors,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
      success: false,
    };
  }
  
  if (!admin.apps.length) {
      console.error("Firebase Admin SDK is not initialized.");
      return { message: "Server configuration error. Please check your service-account.json file.", success: false };
  }

  const db = getFirestore();
  const { email, password } = validatedFields.data;

  try {
    const usersRef = db.collection("users");
    const q = usersRef.where("email", "==", email);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return { message: "No user found with this email address.", success: false };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const uid = userDoc.id;

    if (!userData.password) {
        return { message: "This account does not have a password set. Please try another login method or reset your password.", success: false };
    }

    const isPasswordValid = verifyPassword(userData.password, password);

    if (!isPasswordValid) {
        return { message: "Incorrect password. Please try again.", success: false };
    }

    console.log(`User ${userData.name} password verified. Generating custom token.`);

    const customToken = await admin.auth().createCustomToken(uid);

    return { message: "success", success: true, customToken };

  } catch (error: any) {
    console.error("Login Error:", error);
    if (error instanceof Error && error.message.includes('permission-denied')) {
        return { message: "Permission denied. Please check your Firestore security rules.", success: false };
    }
    return {
      message: "An unexpected error occurred during login. Please try again.",
      success: false
    };
  }
}
