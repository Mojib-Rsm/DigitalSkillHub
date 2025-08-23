
import * as admin from 'firebase-admin';

// Check if all required environment variables are available
const hasAllCredentials = 
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

// Initialize Firebase Admin SDK only if it hasn't been initialized and all credentials are present
if (!admin.apps.length && hasAllCredentials) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
} else if (!admin.apps.length) {
    console.warn("Firebase Admin SDK not initialized. Missing required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). This is expected during local build if credentials are not set.");
}


// Export firestore and auth instances, which will be undefined if initialization fails
// This prevents crashes in services that import them, they will just fail gracefully
// if called without proper initialization.
export const adminDb = admin.apps.length ? admin.firestore() : undefined;
export const adminAuth = admin.apps.length ? admin.auth() : undefined;
export default admin;
