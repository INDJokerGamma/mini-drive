import admin from 'firebase-admin';
import { createRequire } from 'module'; // Moved to the top level!

// Check if we are on Render (using environment variable) or Local (using file)
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    // Now we just use the require function we imported at the top
    const require = createRequire(import.meta.url);
    serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { db };