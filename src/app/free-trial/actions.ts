
"use server";

import { z } from "zod";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from "firebase-admin/firestore";
import { app } from "@/lib/firebase-admin";
import { sendSms } from "@/services/sms-service";
import crypto from "crypto";

const SignUpStep1Schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  phone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number." }),
  step: z.literal("1"),
});

const VerifyOTPSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});


type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  step?: "1" | "2" | "success";
  success?: boolean;
};


async function sendOTP(email: string, phone: string) {
    if (!app) {
        console.error("Firebase Admin SDK is not initialized. Cannot send OTP.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }
    const db = getFirestore(app);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        await setDoc(doc(db, "otps", email), { code: otp, phone, expires: expires.toISOString() });
        
        const smsResult = await sendSms(phone, `Your TotthoAi verification code is: ${otp}`);

        if (!smsResult.success) {
            console.error("SMS Sending failed:", smsResult.message);
            // In production, this should likely return an error. For now, we log it.
             return { success: false, message: `Failed to send SMS. Gateway response: ${smsResult.message}` };
        }
        
        console.log(`OTP for ${phone} is ${otp}`); // Log OTP for testing/debugging
        return { success: true, message: `An OTP has been sent to ${phone}.` };

    } catch (error) {
        console.error("Error saving OTP or sending SMS:", error);
        return { success: false, message: "Could not send verification code due to a server error." };
    }
}


export async function signupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;

  const validatedFields = SignUpStep1Schema.safeParse(fields);

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      issues: validatedFields.error.flatten().formErrors,
      fields,
      step: "1",
      success: false,
    };
  }
  
  if (!app) {
      return { message: "Server configuration error.", fields, step: "1", success: false };
  }

  try {
      const db = getFirestore(app);
      const usersRef = collection(db, "users");
      
      const emailQuery = query(usersRef, where("email", "==", validatedFields.data.email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
          return { message: "An account with this email already exists.", fields, step: "1", success: false };
      }

      const phoneQuery = query(usersRef, where("phone", "==", validatedFields.data.phone));
      const phoneSnapshot = await getDocs(phoneQuery);
      if (!phoneSnapshot.empty) {
          return { message: "An account with this phone number already exists.", fields, step: "1", success: false };
      }

  } catch (error: any) {
       console.error("Error checking for existing user:", error);
       return { message: "Could not verify user details due to a database error.", fields, step: "1", success: false };
  }

  const otpResult = await sendOTP(validatedFields.data.email, validatedFields.data.phone);

  if (!otpResult.success) {
      return { message: otpResult.message, fields, step: "1", success: false };
  }
  
  return {
      message: otpResult.message,
      fields,
      step: "2",
      success: true,
  };
}


export async function verifyOtpAction(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const validatedFields = VerifyOTPSchema.safeParse({ email, otp });

    if (!validatedFields.success) {
        return { success: false, message: "Invalid OTP format." };
    }
    
    if (!app) {
        return { success: false, message: "Server configuration error." };
    }

    const db = getFirestore(app);

    try {
        const otpDocRef = doc(db, "otps", email);
        const otpDoc = await getDoc(otpDocRef);

        if (!otpDoc.exists()) {
            return { success: false, message: "Invalid OTP or it has expired. Please try again." };
        }
        
        const otpData = otpDoc.data();
        if (otpData.code !== otp || new Date(otpData.expires) < new Date()) {
            return { success: false, message: "Invalid OTP or it has expired. Please try again." };
        }

        // OTP is correct, delete it so it can't be reused.
        await deleteDoc(otpDocRef);

        return { success: true, message: "OTP verified successfully!" };

    } catch (error) {
        console.error("OTP Verification error:", error);
        return { success: false, message: "Failed to verify OTP due to a server error." };
    }
}
