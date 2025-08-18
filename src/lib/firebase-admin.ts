
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

// To prevent the error when FIREBASE_SERVICE_ACCOUNT is not set,
// we only initialize the admin app if the service account is available.
// The app should gracefully handle cases where the admin app is not initialized.
let app;
if (getApps().length === 0) {
    if (serviceAccount) {
        app = initializeApp({
            credential: cert(serviceAccount),
        }, 'firebase-admin');
    } else {
        console.warn('Firebase service account credentials not found. Server-side Firebase features will be disabled.');
        // Initialize a dummy app or handle it as per your app's logic
        // For now, we'll just not initialize it.
    }
} else {
    app = getApp('firebase-admin');
}


export { app };
