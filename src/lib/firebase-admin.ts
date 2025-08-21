
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';

let adminApp: App;

// The service account key is expected to be in an environment variable
// for security reasons, especially in a production environment.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  if (process.env.NODE_ENV === 'production') {
      console.error("Firebase service account credentials are not set in environment variables.");
      // In production, we might want to throw an error to prevent the app from starting without credentials.
      throw new Error("Firebase service account credentials are not set in environment variables.");
  } else {
      console.warn("Firebase service account credentials are not set. Some admin features may not work.");
      // For local development, we can allow the app to run without admin creds, but features will be limited.
  }
}

const serviceAccount = serviceAccountString ? JSON.parse(serviceAccountString) : undefined;

if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
} else {
  adminApp = getApp();
}

export { adminApp };
