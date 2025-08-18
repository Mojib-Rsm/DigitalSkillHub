
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!serviceAccount) {
  console.warn('Firebase service account credentials not found. Some server-side Firebase features may not work.');
}

const app = getApps().length
  ? getApp('firebase-admin')
  : initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
    }, 'firebase-admin');

export { app };
