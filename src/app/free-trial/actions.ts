
"use server";

import { z } from "zod";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/lib/firebase-admin";

const db = getFirestore(app);
const auth = getAuth(app);

const SignUpSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  idToken: z.string().min(1, { message: "Authentication token is required." }),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }

  const { name, email, idToken } = validatedFields.data;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Save user to Firestore
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      createdAt: new Date(),
    });

    return { message: "success" };
  } catch (error) {
    console.error("Firestore user creation error:", error);
    if (error instanceof Error && error.message.includes('permission-denied')) {
        return { message: "Permission denied. Please check your Firestore security rules." };
    }
    return { message: "An unexpected error occurred while saving user data." };
  }
}
