import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBa00zLQrvgCAq6i3sEdcTIpPvIZfpjhNE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anantclinic-5ed24.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anantclinic-5ed24",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anantclinic-5ed24.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "455950112252",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:455950112252:web:9de8efad9bce7242a48e79"
};

let db;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Client SDK initialized successfully (anantclinic-5ed24).");
  }
  db = firebase.firestore();
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Provide defensive mock fallback to prevent runtime crashes if initialization fails
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
