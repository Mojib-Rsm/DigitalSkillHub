
import admin from 'firebase-admin';

// This file now only exports the admin object.
// Initialization is handled on-demand within the server actions that need it
// to ensure environment variables are loaded correctly.
// A check for existing apps is performed in each action before initialization.

export { admin };
