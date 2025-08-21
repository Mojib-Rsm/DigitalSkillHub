
"use server";

import 'dotenv/config';
import { z } from "zod";
import crypto from "crypto";
import admin from "firebase-admin";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountString) {
      throw new Error('The GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization failed in signup action:', e.message);
    // We'll allow the action to proceed, but it will likely fail with a clearer error below.
  }
}


type SmsApiResponse = {
    response_code?: number;
    message_id?: number;
    success_message?: string;
    error_message?: string;
    message?: string; // For general error cases
}


async function sendSms(phoneNumber: string, message: string): Promise<{success: boolean, message: string}> {
  const apiKey = "LkcuBmpXSgO77LgytC9w";
  const senderId = "8809617614208";

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
    
    const responseText = await response.text();
    try {
        const result: SmsApiResponse = JSON.parse(responseText);
        
        if (result.response_code === 202) {
            return { success: true, message: result.success_message || "SMS sent successfully." };
        } else {
            const errorMessage = result.error_message || result.message || 'Unknown API error';
            console.error("Failed to send SMS:", errorMessage);
            return { success: false, message: `Failed to send SMS: ${errorMessage}` };
        }
    } catch (jsonError) {
        console.error("Failed to parse SMS API response as JSON. Response body:", responseText);
        return { success: false, message: `SMS API returned an unexpected response: ${responseText}` };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred: ${error.message}`};
    }
    return { success: false, message: 'An unexpected error occurred while sending SMS.' };
  }
}


const SignUpStep1Schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  phone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number." }),
  step: z.literal("1"),
});

const VerifyAndCreateUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().regex(/^01[3-9]\d{8}$/),
    otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

// Helper function to hash password
function simpleHash(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}


type SignUpFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  step?: "1" | "2" | "success";
  success?: boolean;
};

type VerifyFormState = {
    message: string;
    success: boolean;
    customToken?: string;
}


async function sendOTP(email: string, phone: string) {
    if (!admin.apps.length) {
        console.error("Firebase Admin SDK is not initialized. Cannot send OTP.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }
    const db = admin.firestore();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        const batch = db.batch();
        const otpRef = db.collection("otps").doc(email);
        batch.set(otpRef, { code: otp, phone, expires: expires.toISOString() });
        
        await batch.commit();

        const smsResult = await sendSms(phone, `Your TotthoAi verification code is: ${otp}`);

        if (!smsResult.success) {
            console.error("SMS Sending failed:", smsResult.message);
            return { success: false, message: `Could not send verification code. ${smsResult.message}` };
        }
        
        console.log(`OTP for ${phone} is ${otp}`); // Log OTP for testing/debugging
        return { success: true, message: `An OTP has been sent to ${phone}.` };

    } catch (error) {
        console.error("Error saving OTP or sending SMS:", error);
        return { success: false, message: "Could not send verification code due to a server error." };
    }
}


export async function signupAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
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
  
  if (!admin.apps.length) {
      return { message: "Server configuration error. Please check your service-account.json file.", fields, step: "1", success: false };
  }
  
  const db = admin.firestore();
  const usersRef = db.collection("users");

  // Check if email or phone already exists
  const emailQuery = usersRef.where("email", "==", validatedFields.data.email);
  const phoneQuery = usersRef.where("phone", "==", validatedFields.data.phone);
  
  try {
    const [emailSnapshot, phoneSnapshot] = await Promise.all([emailQuery.get(), phoneQuery.get()]);

    if (!emailSnapshot.empty) {
        return { message: "An account with this email already exists.", fields, step: "1", success: false };
    }
    if (!phoneSnapshot.empty) {
        return { message: "An account with this phone number already exists.", fields, step: "1", success: false };
    }
  } catch (e) {
      console.error("Error checking for existing user:", e);
      return { message: "Could not complete signup. Please try again later.", fields, step: "1", success: false };
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


export async function verifyAndCreateUserAction(
    prevState: VerifyFormState,
    formData: FormData
): Promise<VerifyFormState> {
    const fields = Object.fromEntries(formData.entries());
    const validatedFields = VerifyAndCreateUserSchema.safeParse(fields);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided. Please check the form." };
    }

    if (!admin.apps.length) {
        return { success: false, message: "Server configuration error. Cannot create user." };
    }

    const { email, otp, name, password, phone } = validatedFields.data;
    const db = admin.firestore();

    try {
        const otpDocRef = db.collection("otps").doc(email);
        const otpDoc = await otpDocRef.get();

        if (!otpDoc.exists) {
            return { success: false, message: "Invalid OTP or it has expired. Please try registering again." };
        }
        
        const otpData = otpDoc.data();
        if (otpData!.code !== otp || new Date(otpData!.expires) < new Date()) {
            await otpDocRef.delete();
            return { success: false, message: "Invalid OTP or it has expired. Please try registering again." };
        }

        // OTP is correct, create user and delete OTP
        // Use a transaction to ensure atomicity
        const userRef = db.collection("users").doc(); // Let firestore generate a new ID
        const batch = db.batch();

        batch.set(userRef, {
            uid: userRef.id,
            name,
            email,
            phone,
            password: simpleHash(password),
            createdAt: new Date().toISOString(),
        });
        
        batch.delete(otpDocRef);
        
        await batch.commit();

        const customToken = await admin.auth().createCustomToken(userRef.id);

        return { success: true, message: "Account created successfully!", customToken };

    } catch (error) {
        console.error("User creation error:", error);
        if (error instanceof Error && error.message.includes('permission-denied')) {
            return { success: false, message: "Database permission error. Please check your Firestore security rules." };
        }
        return { success: false, message: "Failed to create user due to a server error." };
    }
}
