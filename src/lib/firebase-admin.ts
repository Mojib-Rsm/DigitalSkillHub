
import admin from 'firebase-admin';
import serviceAccount from '@/../service-account.json';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    if (e.code === 'invalid-credential') {
      console.error(
        'Firebase Admin SDK initialization failed: The service account credentials are not valid. Please check your service-account.json file.'
      );
    } else {
      console.error('Firebase Admin SDK initialization failed:', e.message);
    }
    // Set app to null or handle the error as appropriate for your application
    // For now, we'll let it be undefined and checks elsewhere will handle it.
  }
} else {
  app = admin.apps[0]!;
}

// @ts-ignore
export { app };
