import { config } from "dotenv";
config({ path: ".env.local" });

import { getFirestore } from "../lib/firebase-admin";

const COLLECTIONS_TO_FLUSH = [
  "chat_logs",
  "chat_sessions",
  "suggested_questions",
] as const;

const BATCH_SIZE = 400;

async function deleteCollection(collectionName: string): Promise<number> {
  const db = getFirestore();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local."
    );
  }

  let deleted = 0;

  while (true) {
    const snap = await db.collection(collectionName).limit(BATCH_SIZE).get();
    if (snap.empty) break;

    const batch = db.batch();
    for (const doc of snap.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();
    deleted += snap.size;
    console.log(`[flush] deleted ${deleted} from ${collectionName}`);
  }

  return deleted;
}

async function main(): Promise<void> {
  let total = 0;

  for (const collectionName of COLLECTIONS_TO_FLUSH) {
    const deleted = await deleteCollection(collectionName);
    total += deleted;
    console.log(`[flush] ${collectionName}: ${deleted} deleted`);
  }

  console.log(`[flush] done. deleted ${total} Firestore documents.`);
}

main().catch((err) => {
  console.error("[flush] failed", err);
  process.exit(1);
});
