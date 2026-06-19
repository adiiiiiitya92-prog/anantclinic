import admin from 'firebase-admin';

let db;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (projectId && clientEmail && privateKey) {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
    }
  }
  db = admin.firestore();
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      "⚠️ WARNING: Firebase credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) " +
      "are missing from your .env file. Using a mock database instance to prevent build-time crashes."
    );
  }
  
  // Provide a robust mock Firestore client so Next.js static builds do not crash
  const mockDoc = {
    get: async () => ({ 
      exists: false, 
      id: 'mock-id',
      data: () => ({}) 
    }),
    set: async () => ({ success: true }),
    update: async () => ({ success: true }),
    delete: async () => ({ success: true })
  };

  const mockCollection = {
    doc: () => mockDoc,
    orderBy: () => ({
      get: async () => ({ docs: [] })
    }),
    get: async () => ({ docs: [] }),
    add: async () => ({ id: 'mock-id' })
  };

  db = {
    collection: () => mockCollection
  };
}

export { db };
