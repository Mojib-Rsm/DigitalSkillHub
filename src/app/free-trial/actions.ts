
"use server";

import { z } from "zod";
import { getFirestore, doc, setDoc, getDoc } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/lib/firebase-admin";
import { sendSms } from "@/services/sms-service";

const OTPSchema = z.object({
  code: z.string().length(6),
  email: z.string().email(),
  expires: z.date(),
});

const SignUpStep1Schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  phone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number." }),
  step: z.literal("1"),
});

const SignUpStep2Schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
  step: z.literal("2"),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  step?: "1" | "2" | "success";
};

async function verifyAndSaveOtp(email: string, phone: string) {
    if (!app) return { success: false, message: "Server configuration error." };
    const db = getFirestore(app);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        await setDoc(doc(db, "otps", email), { code: otp, phone, expires: expires.toISOString() });
        
        const smsResult = await sendSms(phone, `Your TotthoAi verification code is: ${otp}`);

        if (!smsResult.success) {
            return { success: false, message: smsResult.message };
        }
        
        return { success: true, message: "OTP sent successfully." };

    } catch (error) {
        console.error("Error saving OTP or sending SMS:", error);
        return { success: false, message: "Could not send verification code." };
    }
}

export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const step = formData.get("step") as "1" | "2";
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;

  if (step === "1") {
    const validatedFields = SignUpStep1Schema.safeParse(fields);

    if (!validatedFields.success) {
      return {
        message: "Validation Error",
        issues: validatedFields.error.flatten().fieldErrors.root,
        fields,
        step: "1",
      };
    }
    
    // Check if user already exists
    if (app) {
        try {
            const auth = getAuth(app);
            await auth.getUserByEmail(validatedFields.data.email);
            return { message: "An account with this email already exists.", fields, step: "1" };
        } catch (error: any) {
            if (error.code !== 'auth/user-not-found') {
                 return { message: "Could not verify user. Please try again.", fields, step: "1" };
            }
            // User not found, which is good. Continue.
        }
    }


    const otpResult = await verifyAndSaveOtp(validatedFields.data.email, validatedFields.data.phone);

    if (!otpResult.success) {
        return { message: otpResult.message, fields, step: "1" };
    }
    
    return {
        message: `An OTP has been sent to ${validatedFields.data.phone}.`,
        fields,
        step: "2",
    };
  }
  
  if (step === "2") {
      const validatedFields = SignUpStep2Schema.safeParse(fields);
       if (!validatedFields.success) {
          return {
            message: "Validation Error",
            issues: validatedFields.error.flatten().fieldErrors.otp,
            fields,
            step: "2",
          };
       }
       
      if (!app) {
          return { message: "Server configuration error.", fields, step: "2" };
      }

      const db = getFirestore(app);
      const auth = getAuth(app);
      const { email, password, name, phone, otp } = validatedFields.data;

      try {
          const otpDocRef = doc(db, "otps", email);
          const otpDoc = await getDoc(otpDocRef);

          if (!otpDoc.exists()) {
              return { message: "Invalid OTP or it has expired. Please try again.", fields, step: "1" };
          }
          
          const otpData = otpDoc.data();
          if (otpData.code !== otp || new Date(otpData.expires) < new Date()) {
              return { message: "Invalid OTP or it has expired. Please try again.", fields, step: "1" };
          }
          
          // OTP is valid, create user in Firebase Auth
          const userRecord = await auth.createUser({
              email,
              password,
              displayName: name,
              phoneNumber: `+88${phone}`,
              emailVerified: true, // Since we verified via OTP, we can consider email as indirectly verified.
          });
          
          // Save user to Firestore
          await setDoc(doc(db, "users", userRecord.uid), {
            name,
            email,
            phone,
            createdAt: new Date().toISOString(),
          });

          // Delete OTP from Firestore
          await setDoc(otpDocRef, { code: null }, { merge: true });

          return { message: "Account created successfully!", step: "success" };

      } catch (error) {
          console.error("User creation error:", error);
          return { message: "Failed to create account. Please try again.", fields, step: "1" };
      }
  }
  
  return { message: "Invalid form submission.", fields: {}, step: "1" };
}
