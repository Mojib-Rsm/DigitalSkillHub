
import admin from 'firebase-admin';

// This file now only exports the admin object.
// Initialization is now handled on-demand within the server actions that need it
// to ensure environment variables are loaded correctly and avoid edge runtime issues.
// A check for existing apps is performed in each action before initialization.

export { admin };
