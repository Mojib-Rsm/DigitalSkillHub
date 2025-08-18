
"use server";

import { z } from "zod";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc, writeBatch } from "firebase-admin/firestore";
import { app } from "@/lib/firebase-admin";

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

// Moved sendSms logic directly here to avoid process.env issues in the service file.
async function sendSms(phoneNumber: string, message: string): Promise<{success: boolean, message: string}> {
  const apiKey = "LkcuBmpXSgO77LgytC9w";
  const senderId = "8809617614208";

  if (!apiKey || !senderId) {
    const errorMessage = "SMS API Key or Sender ID is not configured.";
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  try {
    const response = await fetch('http://bulksmsbd.net/api/smsapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        senderid: senderId,
        number: phoneNumber,
        message: message,
      }),
    });
    
    const result: { code: string; message: string } = await response.json();

    if (result.code === "ok") {
        console.log("SMS sent successfully to:", phoneNumber);
        return { success: true, message: "SMS sent successfully." };
    } else {
        console.error("Failed to send SMS:", result.message);
        return { success: false, message: `Failed to send SMS: ${result.message}` };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred: ${error.message}`};
    }
    return { success: false, message: 'An unexpected error occurred while sending SMS.' };
  }
}


async function sendOTP(email: string, phone: string) {
    if (!app) {
        console.error("Firebase Admin SDK is not initialized. Cannot send OTP.");
        // This is the source of the "Server configuration error."
        return { success: false, message: "Server configuration error. Please contact support." };
    }
    const db = getFirestore(app);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        // We will now write to a separate 'otps' collection which can have more open rules.
        const batch = db.batch();
        const otpRef = doc(db, "otps", email);
        batch.set(otpRef, { code: otp, phone, expires: expires.toISOString() });
        
        await batch.commit();

        const smsResult = await sendSms(phone, `Your TotthoAi verification code is: ${otp}`);

        if (!smsResult.success) {
            console.error("SMS Sending failed:", smsResult.message);
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
    const issues = validatedFields.error.flatten().fieldErrors;
    const allIssues = [
        ...(issues.name || []),
        ...(issues.email || []),
        ...(issues.password || []),
        ...(issues.phone || []),
    ];
    return {
      message: "Validation Error",
      issues: allIssues,
      fields,
      step: "1",
      success: false,
    };
  }
  
  // The Admin App check is the source of the error. We will rely on client-side checks for existing users.
  // The sendOTP function will still use the admin app, but we are isolating the problem.
  // if (!app) {
  //     return { message: "Server configuration error.", fields, step: "1", success: false };
  // }
  
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
            // OTP is incorrect or expired, delete it.
            await deleteDoc(otpDocRef);
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
