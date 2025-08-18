
"use server";

import { z } from "zod";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

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

  const { uid, email, name } = validatedFields.data;

  try {
    // Add or update user in Firestore. `merge: true` creates the doc if it doesn't exist.
    await setDoc(doc(db, "users", uid), {
      email,
      name: name || email.split('@')[0],
      lastLogin: new Date(),
    }, { merge: true });

    // Here you would typically set a cookie or session for the user
    // For this example, we'll just return success
    return { message: "success" };

  } catch (error: any) {
    console.error("Firestore Error:", error);
    return {
      message: "Failed to save user data. Please try again.",
    };
  }
}
