
"use server";

import { z } from "zod";
import { getFirestore, collection, query, where, getDocs } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import crypto from "crypto";

// --- Firebase Admin SDK Initialization ---
// IMPORTANT: This configuration is now hardcoded to bypass environment variable issues.
const serviceAccount = {
  "type": "service_account",
  "project_id": "map-api-427111",
  "private_key_id": "your_private_key_id", // Replace with your actual private key ID
  "private_key": "your_private_key", // Replace with your actual private key
  "client_email": "firebase-adminsdk-your-sdk-id@map-api-427111.iam.gserviceaccount.com", // Replace with your client email
  "client_id": "your_client_id", // Replace with your client ID
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-your-sdk-id%40map-api-427111.iam.gserviceaccount.com" // Replace with your cert url
};

let app: App;
if (!getApps().length) {
    try {
        app = initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (e: any) {
        if (e.code === 'invalid-credential') {
            console.error("Firebase Admin SDK initialization failed: The service account credentials are not valid. Please check your configuration.");
        } else {
            console.error("Firebase Admin SDK initialization failed:", e.message);
        }
    }
} else {
    app = getApps()[0];
}
// --- End Firebase Admin SDK Initialization ---


const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
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
  
  // @ts-ignore
  if (!app) {
      console.error("Firebase Admin SDK is not initialized.");
      return { message: "Server configuration error. Please contact support.", success: false };
  }

  const db = getFirestore(app);
  const { email, password } = validatedFields.data;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { message: "No user found with this email address.", success: false };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.password) {
        return { message: "This account does not have a password set. Please try another login method or reset your password.", success: false };
    }

    const isPasswordValid = verifyPassword(userData.password, password);

    if (!isPasswordValid) {
        return { message: "Incorrect password. Please try again.", success: false };
    }

    console.log(`User ${userData.name} logged in successfully.`);

    return { message: "success", success: true };

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
