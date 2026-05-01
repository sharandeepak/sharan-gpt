import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import {
  FieldValue,
  getFirestore as getAdminFirestore,
  type Firestore,
} from "firebase-admin/firestore";

export { FieldValue } from "firebase-admin/firestore";

export const SERVER_TIMESTAMP = FieldValue.serverTimestamp();

let cachedApp: App | null = null;
let cachedFirestore: Firestore | null = null;
let initAttempted = false;

function readConfig(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    return null;
  }

  // Vercel / .env stores literal "\n" in the key; convert to real newlines.
  const privateKey = rawKey.replace(/\\n/g, "\n");
  return { projectId, clientEmail, privateKey };
}

export function isFirebaseConfigured(): boolean {
  return readConfig() !== null;
}

export function getFirestore(): Firestore | null {
  if (cachedFirestore) return cachedFirestore;
  if (initAttempted && !cachedApp) return null;

  const config = readConfig();
  if (!config) {
    initAttempted = true;
    return null;
  }

  try {
    const existing = getApps();
    if (existing.length > 0) {
      cachedApp = existing[0]!;
    } else {
      cachedApp = initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        projectId: config.projectId,
      });
    }
    cachedFirestore = getAdminFirestore(cachedApp);
    initAttempted = true;
    return cachedFirestore;
  } catch (err) {
    initAttempted = true;
    cachedApp = null;
    cachedFirestore = null;
    // Surface during dev but never throw at import time.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[firebase-admin] init failed:", err);
    }
    return null;
  }
}
