
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';

let app: App | undefined;

// This function ensures that the admin app is initialized only once.
function initializeAdminApp(): App | undefined {
    // If the admin app is already initialized, return it.
    if (getApps().length > 0) {
        return getApp();
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    // Check if the service account credentials are in the environment variables.
    if (serviceAccountString) {
        try {
            const serviceAccount = JSON.parse(serviceAccountString);
            // Initialize the app with the service account credentials.
            return initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error) {
            console.error("Failed to parse Firebase service account JSON. Make sure the environment variable is set correctly and is a single line.", error);
            return undefined;
        }
    } else {
        // Warn the developer if the credentials are not found.
        // This is crucial for debugging server-side operations.
        console.warn('FIREBASE_SERVICE_ACCOUNT environment variable not found. Server-side Firebase features will be disabled.');
        return undefined;
    }
}

// Initialize the app and export it.
// The app variable will be undefined if initialization fails.
app = initializeAdminApp();

export { app };
