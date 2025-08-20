
import admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountString) {
      throw new Error('The GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization failed:', e.message);
  }
} else {
  app = admin.apps[0]!;
}

// @ts-ignore
export { app, admin };
