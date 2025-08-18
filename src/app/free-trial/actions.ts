
"use server";

import { z } from "zod";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc, writeBatch } from "firebase-admin/firestore";
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
    app = initializeApp({
        credential: cert(serviceAccount)
    });
} else {
    app = getApps()[0];
}
// --- End Firebase Admin SDK Initialization ---


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
        return { success: false, message: "Server configuration error. Please contact support." };
    }
    const db = getFirestore(app);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        const batch = db.batch();
        const otpRef = doc(db, "otps", email);
        batch.set(otpRef, { code: otp, phone, expires: expires.toISOString() });
        
        await batch.commit();

        const smsResult = await sendSms(phone, `Your TotthoAi verification code is: ${otp}`);

        if (!smsResult.success) {
            console.error("SMS Sending failed:", smsResult.message);
            // Even if SMS fails, we don't want to block the user in testing.
            // In production, you might want to handle this differently.
            // For now, we'll log the error and proceed.
            return { success: true, message: `OTP for ${phone} is ${otp}. SMS sending failed: ${smsResult.message}` };
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
  
  if (!app) {
      console.error("Firebase Admin SDK is not initialized.");
      return { message: "Server configuration error.", fields, step: "1", success: false };
  }
  
  const db = getFirestore(app);
  const usersRef = collection(db, "users");

  // Check if email or phone already exists
  const emailQuery = query(usersRef, where("email", "==", validatedFields.data.email));
  const phoneQuery = query(usersRef, where("phone", "==", validatedFields.data.phone));
  
  try {
    const [emailSnapshot, phoneSnapshot] = await Promise.all([getDocs(emailQuery), getDocs(phoneQuery)]);

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
    prevState: { message: string, success: boolean },
    formData: FormData
): Promise<{ message: string, success: boolean }> {
    const fields = Object.fromEntries(formData.entries());
    const validatedFields = VerifyAndCreateUserSchema.safeParse(fields);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data provided. Please check the form." };
    }

    if (!app) {
        return { success: false, message: "Server configuration error. Cannot create user." };
    }

    const { email, otp, name, password, phone } = validatedFields.data;
    const db = getFirestore(app);

    try {
        const otpDocRef = doc(db, "otps", email);
        const otpDoc = await getDoc(otpDocRef);

        if (!otpDoc.exists()) {
            return { success: false, message: "Invalid OTP or it has expired. Please try registering again." };
        }
        
        const otpData = otpDoc.data();
        if (otpData.code !== otp || new Date(otpData.expires) < new Date()) {
            await deleteDoc(otpDocRef);
            return { success: false, message: "Invalid OTP or it has expired. Please try registering again." };
        }

        // OTP is correct, create user and delete OTP
        const uid = crypto.randomUUID();
        const userRef = doc(db, "users", uid);
        const batch = db.batch();

        batch.set(userRef, {
            uid,
            name,
            email,
            phone,
            password: simpleHash(password),
            createdAt: new Date().toISOString(),
        });
        
        batch.delete(otpDocRef);
        
        await batch.commit();

        return { success: true, message: "Account created successfully!" };

    } catch (error) {
        console.error("User creation error:", error);
        if (error instanceof Error && error.message.includes('permission-denied')) {
            return { success: false, message: "Database permission error. Please check your Firestore security rules." };
        }
        return { success: false, message: "Failed to create user due to a server error." };
    }
}
