
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
        });
    } else {
        console.warn('Firebase service account credentials not found. Server-side Firebase features will be disabled.');
    }
} else {
    // Check if the admin app is already initialized, otherwise get the default app.
    // This logic might need adjustment depending on how many apps you expect to initialize.
    try {
      app = getApp('firebase-admin');
    } catch(e) {
      app = getApp();
    }
}


export { app };
