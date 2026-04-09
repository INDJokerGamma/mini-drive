import admin from 'firebase-admin';
import { createRequire } from 'module';

// Because we are using modern "ES Modules" (import/export), importing a JSON 
// file requires a tiny workaround in Node.js. This lets us read our secret key file.
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin application using our secret credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Create a shortcut to our Firestore database
const db = admin.firestore();

// Export the database so we can use it in other files
export { db };