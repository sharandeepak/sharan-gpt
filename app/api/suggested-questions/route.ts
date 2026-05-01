export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";

import { getFirestore, isFirebaseConfigured } from "@/lib/firebase-admin";

interface SuggestedQuestionItem {
  id: string;
  question: string;
  category: string;
  priority: number;
}

interface SuggestedQuestionAnswer extends SuggestedQuestionItem {
  answer: string;
}

const FALLBACK_QUESTIONS: ReadonlyArray<{
  question: string;
  category: string;
  priority: number;
}> = [
  { question: "Who is Sharan Deepak?", category: "overview", priority: 1 },
  { question: "What are his strongest backend skills?", category: "skills", priority: 2 },
  { question: "What impact did he create at SurveySparrow?", category: "impact", priority: 3 },
  { question: "Has he worked on scalable systems?", category: "impact", priority: 4 },
  {
    question: "What are his Elasticsearch and PostgreSQL achievements?",
    category: "skills",
    priority: 5,
  },
  {
    question: "What makes him suitable for a senior developer role?",
    category: "overview",
    priority: 6,
  },
  { question: "Has he worked with AI tools?", category: "tools", priority: 7 },
  { question: "Has he built mobile apps?", category: "projects", priority: 8 },
  { question: "What are his strongest projects?", category: "projects", priority: 9 },
  { question: "How can I contact him?", category: "contact", priority: 10 },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isStringRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export async function GET(): Promise<NextResponse> {
  if (!isFirebaseConfigured()) {
    const items: SuggestedQuestionItem[] = FALLBACK_QUESTIONS.map((q) => ({
      id: slugify(q.question),
      question: q.question,
      category: q.category,
      priority: q.priority,
    }));
    return NextResponse.json({ items });
  }

  const db = getFirestore();
  if (!db) {
    const items: SuggestedQuestionItem[] = FALLBACK_QUESTIONS.map((q) => ({
      id: slugify(q.question),
      question: q.question,
      category: q.category,
      priority: q.priority,
    }));
    return NextResponse.json({ items });
  }

  try {
    const snap = await db
      .collection("suggested_questions")
      .where("isActive", "==", true)
      .orderBy("priority", "asc")
      .get();

    const items: SuggestedQuestionItem[] = snap.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => {
      const data = doc.data();
      return {
        id: doc.id,
        question: typeof data.question === "string" ? data.question : "",
        category: typeof data.category === "string" ? data.category : "",
        priority: typeof data.priority === "number" ? data.priority : 0,
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[suggested-questions] GET failed", err);
    const items: SuggestedQuestionItem[] = FALLBACK_QUESTIONS.map((q) => ({
      id: slugify(q.question),
      question: q.question,
      category: q.category,
      priority: q.priority,
    }));
    return NextResponse.json({ items });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!isStringRecord(body) || typeof body.id !== "string" || body.id.length === 0) {
    return NextResponse.json({ error: "id_required" }, { status: 400 });
  }
  const id = body.id;

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "curated_unavailable" }, { status: 503 });
  }

  const db = getFirestore();
  if (!db) {
    return NextResponse.json({ error: "curated_unavailable" }, { status: 503 });
  }

  try {
    const ref = db.collection("suggested_questions").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const data = snap.data() ?? {};
    if (data.isActive === false) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const result: SuggestedQuestionAnswer = {
      id: snap.id,
      question: typeof data.question === "string" ? data.question : "",
      answer: typeof data.answer === "string" ? data.answer : "",
      category: typeof data.category === "string" ? data.category : "",
      priority: typeof data.priority === "number" ? data.priority : 0,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("[suggested-questions] POST failed", err);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
}
