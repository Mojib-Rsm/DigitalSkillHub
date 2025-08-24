
import * as admin from 'firebase-admin';

// Check if the SDK is already initialized
if (!admin.apps.length) {
    try {
        // Use environment variables directly, which are more secure and flexible than a JSON file.
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace escaped newlines in the private key
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        // Ensure all required credentials are provided
        if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
             admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
             });
        } else {
            console.warn("Firebase Admin SDK not initialized. Missing one or more required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).");
        }
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
    }
}


// Export firestore and auth instances, which will be undefined if initialization fails
// This prevents crashes in services that import them, they will just fail gracefully
// if called without proper initialization.
export const adminDb = admin.apps.length ? admin.firestore() : undefined;
export const adminAuth = admin.apps.length ? admin.auth() : undefined;
export default admin;
