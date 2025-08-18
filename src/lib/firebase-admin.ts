
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';

let app: App | undefined;

// This function ensures that the admin app is initialized only once.
function initializeAdminApp() {
    if (getApps().some(app => app.name === 'firebase-admin')) {
        return getApp('firebase-admin');
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountString) {
        try {
            const serviceAccount = JSON.parse(serviceAccountString);
            return initializeApp({
                credential: cert(serviceAccount),
            }, 'firebase-admin');
        } catch (error) {
            console.error("Failed to parse Firebase service account JSON:", error);
            return undefined;
        }
    } else {
        console.warn('Firebase service account credentials not found. Server-side Firebase features will be disabled.');
        return undefined;
    }
}

app = initializeAdminApp();

export { app };
