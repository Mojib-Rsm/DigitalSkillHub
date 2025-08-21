
import admin from 'firebase-admin';

// This file now only exports the admin object.
// Initialization is handled within the server actions that need it
// to ensure environment variables are loaded first.

// Ensure that we don't try to re-initialize if it's already been done.
if (!admin.apps.length) {
    try {
        const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (serviceAccountString) {
            const serviceAccount = JSON.parse(serviceAccountString);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            // This will be logged on the server if the variable is missing.
            console.warn("GOOGLE_APPLICATION_CREDENTIALS_JSON is not set. Firebase Admin SDK might not be initialized.");
        }
    } catch (e: any) {
        console.error('Firebase Admin SDK initialization failed in firebase-admin.ts:', e.message);
    }
}


export { admin };
