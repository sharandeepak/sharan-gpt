export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";

import {
  FieldValue,
  SERVER_TIMESTAMP,
  getFirestore,
  isFirebaseConfigured,
} from "@/lib/firebase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

type Source = "suggested_question" | "free_text";

interface TrackBody {
  sessionId: string;
  source: Source;
  question: string;
  response: string;
  matchedSuggestedQuestionId?: string | null;
  pagePath?: string;
  theme?: string;
}

function isStringRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function isSource(x: unknown): x is Source {
  return x === "suggested_question" || x === "free_text";
}

function isTrackBody(x: unknown): x is TrackBody {
  if (!isStringRecord(x)) return false;
  if (typeof x.sessionId !== "string" || x.sessionId.length === 0) return false;
  if (typeof x.question !== "string" || x.question.length === 0) return false;
  if (typeof x.response !== "string") return false;
  if (!isSource(x.source)) return false;
  if (
    x.matchedSuggestedQuestionId !== undefined &&
    x.matchedSuggestedQuestionId !== null &&
    typeof x.matchedSuggestedQuestionId !== "string"
  ) {
    return false;
  }
  if (x.pagePath !== undefined && typeof x.pagePath !== "string") return false;
  if (x.theme !== undefined && typeof x.theme !== "string") return false;
  return true;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_body" }, { status: 400 });
  }

  if (!isTrackBody(raw)) {
    return NextResponse.json({ ok: false, reason: "invalid_fields" }, { status: 400 });
  }
  const body = raw;

  const rl = checkRateLimit(`track:${body.sessionId}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString(),
        },
      }
    );
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "firestore_unconfigured" });
  }
  const db = getFirestore();
  if (!db) {
    return NextResponse.json({ ok: false, reason: "firestore_unconfigured" });
  }

  const userAgent = req.headers.get("user-agent") ?? "";
  const referrer = req.headers.get("referer") ?? "";
  const pagePath = body.pagePath ?? "";
  const theme = body.theme ?? "";
  const matchedId =
    body.matchedSuggestedQuestionId === undefined ? null : body.matchedSuggestedQuestionId;

  try {
    await db.collection("chat_logs").add({
      sessionId: body.sessionId,
      source: body.source,
      question: body.question,
      response: body.response,
      matchedSuggestedQuestionId: matchedId,
      userAgent,
      pagePath,
      theme,
      createdAt: SERVER_TIMESTAMP,
    });

    const sessionRef = db.collection("chat_sessions").doc(body.sessionId);
    const snap = await sessionRef.get();
    const baseUpdate: Record<string, unknown> = {
      sessionId: body.sessionId,
      lastSeenAt: SERVER_TIMESTAMP,
      totalQuestions: FieldValue.increment(1),
      userAgent,
      referrer,
    };
    if (body.source === "free_text") {
      baseUpdate.freeTextQuestions = FieldValue.increment(1);
    } else {
      baseUpdate.suggestedQuestionClicks = FieldValue.increment(1);
    }
    await sessionRef.set(baseUpdate, { merge: true });
    if (!snap.exists) {
      await sessionRef.set(
        { firstSeenAt: SERVER_TIMESTAMP },
        { merge: true, mergeFields: ["firstSeenAt"] }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track-question] write failed", err);
    return NextResponse.json({ ok: false, reason: "write_failed" });
  }
}
