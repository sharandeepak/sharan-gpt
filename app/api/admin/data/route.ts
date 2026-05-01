export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getFirestore, isFirebaseConfigured } from "@/lib/firebase-admin";
import {
  ADMIN_COOKIE_NAME,
  getAdminSecret,
  verifyAdminToken,
} from "@/lib/session-server";

interface AdminTotals {
  sessions: number;
  questions: number;
  suggestedClicks: number;
  freeText: number;
}

interface MostAskedRow {
  question: string;
  count: number;
}

interface LatestRow {
  id: string;
  sessionId: string;
  question: string;
  response: string;
  source: string;
  theme: string;
  pagePath: string;
  createdAt: string | null;
}

interface ThemeRow {
  theme: string;
  count: number;
}

interface CategoryRow {
  category: string;
  count: number;
}

interface AdminDataResponse {
  isFirestoreConfigured: boolean;
  totals: AdminTotals;
  mostAsked: MostAskedRow[];
  latest: LatestRow[];
  themesUsed: ThemeRow[];
  hrInterests: CategoryRow[];
}

const EMPTY_RESPONSE: AdminDataResponse = {
  isFirestoreConfigured: false,
  totals: { sessions: 0, questions: 0, suggestedClicks: 0, freeText: 0 },
  mostAsked: [],
  latest: [],
  themesUsed: [],
  hrInterests: [],
};

interface ChatLog {
  sessionId: string;
  question: string;
  response: string;
  source: string;
  theme: string;
  pagePath: string;
  matchedSuggestedQuestionId: string | null;
  createdAt: string | null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readMatchedId(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function timestampToIso(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const maybe = value as { toDate?: () => Date };
  if (typeof maybe.toDate === "function") {
    try {
      return maybe.toDate().toISOString();
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET(): Promise<NextResponse> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (adminPassword.length === 0) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value ?? "";
  if (!verifyAdminToken(token, adminPassword, getAdminSecret())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json(EMPTY_RESPONSE);
  }
  const db = getFirestore();
  if (!db) {
    return NextResponse.json(EMPTY_RESPONSE);
  }

  try {
    const logsSnapPromise = db
      .collection("chat_logs")
      .orderBy("createdAt", "desc")
      .limit(1000)
      .get();
    const sessionsCountPromise = db.collection("chat_sessions").count().get();
    const suggestedSnapPromise = db.collection("suggested_questions").get();

    const [logsSnap, sessionsCountSnap, suggestedSnap] = await Promise.all([
      logsSnapPromise,
      sessionsCountPromise.catch(() => null),
      suggestedSnapPromise.catch(() => null),
    ]);

    const logs: ChatLog[] = logsSnap.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => {
      const data = doc.data();
      return {
        sessionId: readString(data.sessionId),
        question: readString(data.question),
        response: readString(data.response),
        source: readString(data.source),
        theme: readString(data.theme),
        pagePath: readString(data.pagePath),
        matchedSuggestedQuestionId: readMatchedId(data.matchedSuggestedQuestionId),
        createdAt: timestampToIso(data.createdAt),
      };
    });

    const totals: AdminTotals = {
      sessions: 0,
      questions: logs.length,
      suggestedClicks: 0,
      freeText: 0,
    };
    if (sessionsCountSnap) {
      totals.sessions = sessionsCountSnap.data().count;
    } else {
      const distinct = new Set<string>();
      for (const l of logs) if (l.sessionId) distinct.add(l.sessionId);
      totals.sessions = distinct.size;
    }
    for (const l of logs) {
      if (l.source === "suggested_question") totals.suggestedClicks += 1;
      else if (l.source === "free_text") totals.freeText += 1;
    }

    const askedCounter = new Map<string, { question: string; count: number }>();
    for (const l of logs) {
      const q = l.question.trim();
      if (q.length === 0) continue;
      const key = q.toLowerCase();
      const existing = askedCounter.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        askedCounter.set(key, { question: q, count: 1 });
      }
    }
    const mostAsked: MostAskedRow[] = Array.from(askedCounter.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const latest: LatestRow[] = logsSnap.docs.slice(0, 25).map((doc: { id: string; data: () => Record<string, unknown> }) => {
      const data = doc.data();
      return {
        id: doc.id,
        sessionId: readString(data.sessionId),
        question: readString(data.question),
        response: readString(data.response),
        source: readString(data.source),
        theme: readString(data.theme),
        pagePath: readString(data.pagePath),
        createdAt: timestampToIso(data.createdAt),
      };
    });

    const themesCounter = new Map<string, number>();
    for (const l of logs) {
      const t = l.theme || "(unknown)";
      themesCounter.set(t, (themesCounter.get(t) ?? 0) + 1);
    }
    const themesUsed: ThemeRow[] = Array.from(themesCounter.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);

    const idToCategory = new Map<string, string>();
    if (suggestedSnap) {
      for (const doc of suggestedSnap.docs) {
        const data = doc.data();
        idToCategory.set(doc.id, readString(data.category) || "(uncategorized)");
      }
    }
    const categoryCounter = new Map<string, number>();
    for (const l of logs) {
      if (!l.matchedSuggestedQuestionId) continue;
      const cat = idToCategory.get(l.matchedSuggestedQuestionId) ?? "(unknown)";
      categoryCounter.set(cat, (categoryCounter.get(cat) ?? 0) + 1);
    }
    const hrInterests: CategoryRow[] = Array.from(categoryCounter.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const response: AdminDataResponse = {
      isFirestoreConfigured: true,
      totals,
      mostAsked,
      latest,
      themesUsed,
      hrInterests,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[admin/data] aggregation failed", err);
    return NextResponse.json({
      ...EMPTY_RESPONSE,
      isFirestoreConfigured: true,
    });
  }
}
