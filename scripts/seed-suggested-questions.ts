import { config } from "dotenv";
config({ path: ".env.local" });
import { FieldValue, getFirestore } from "../lib/firebase-admin";

type SeedQuestion = {
  question: string;
  answer: string;
  category: string;
  priority: number;
};

const QUESTIONS: SeedQuestion[] = [
  {
    question: "Who is Sharan Deepak?",
    answer:
      "Sharan Deepak R B is a backend-focused software engineer based in Chennai with 3 years of experience, currently working as a Software Developer at SurveySparrow. He ships 0 to 1 product features for employee engagement products serving 300,000+ active users across 250+ paying customers.",
    category: "overview",
    priority: 1,
  },
  {
    question: "What are his strongest backend skills?",
    answer:
      "His strongest backend skills are TypeScript, Java with Spring Boot, and C++, paired with PostgreSQL, Redis, and Elasticsearch on the data side. He has hands-on experience with REST API design, schema and database modeling, queue-driven and event-driven processing, Docker, and Git. Foundations include DBMS, OOPS, and Data Structures.",
    category: "skills",
    priority: 2,
  },
  {
    question: "What impact did he create at SurveySparrow?",
    answer:
      "At SurveySparrow he led backend for products serving 300,000+ users across 250+ paying customers, with enterprise rollouts up to 50,000 employees. He built and launched the One-on-Ones module 0 to 1 (architecture, API, schema, services, rollout) and developed the Reward Marketplace covering redemption workflows, voucher lifecycle, and third-party vendor integrations. He also lifted backend AI agent readiness from 0% to 85% through LLM-friendly rules, hooks, and sub-agent workflows.",
    category: "impact",
    priority: 3,
  },
  {
    question: "Has he worked on scalable systems?",
    answer:
      "Yes. He runs backend services for 300,000+ active users across 250+ paying customers, including enterprise tenants of up to 50,000 employees. He cut dashboard load by 60% by replacing SQL-heavy workflows with optimized Elasticsearch queries, and grew portal engagement by roughly 40% via Slack-based workflows, webhooks, and event-driven backend integrations.",
    category: "impact",
    priority: 4,
  },
  {
    question: "What are his Elasticsearch and PostgreSQL achievements?",
    answer:
      "On Elasticsearch he reduced dashboard load by 60% at SurveySparrow by replacing SQL-heavy workflows with optimized queries. On PostgreSQL he owns schema design and database modeling for 0 to 1 features, including the One-on-Ones module and the Reward Marketplace (redemption, voucher lifecycle, vendor integrations). His TicketWise project also used OpenSearch-based retrieval to reduce query latency on lookups.",
    category: "skills",
    priority: 5,
  },
  {
    question: "What makes him suitable for a senior developer role?",
    answer:
      "He combines end-to-end ownership (architecture, API design, schema, services, rollout) with measurable production impact: 300,000+ users, 60% dashboard load reduction, roughly 40% engagement lift, and AI agent readiness raised from 0% to 85%. He has shipped 0 to 1 modules like One-on-Ones and the Reward Marketplace, mentored a 3-person team across mobile and backend, and led internal sessions on automating dev tasks with LLMs.",
    category: "overview",
    priority: 6,
  },
  {
    question: "Has he worked with AI tools?",
    answer:
      "Yes. He raised backend AI agent readiness from 0% to 85% at SurveySparrow by introducing LLM-friendly rules, hooks, and sub-agent workflows, and led internal sessions on automating developer tasks with LLMs. On the Goal Assist project (2025) he built an MCP-powered workflow that captures developer activity and turns it into structured updates surfaced through a manager dashboard.",
    category: "tools",
    priority: 7,
  },
  {
    question: "Has he built mobile apps?",
    answer:
      "His mobile stack includes Flutter and Dart. At SurveySparrow he mentored a 3-person team spanning mobile and backend, guiding implementation, reviewing contributions, and driving delivery. He also holds a Complete Android Development Bootcamp certification (Udemy, 2021).",
    category: "projects",
    priority: 8,
  },
  {
    question: "What are his strongest projects?",
    answer:
      "Goal Assist (Aug 2025 to Oct 2025) is an AI-powered productivity platform with a manager dashboard for priorities, task progress, and execution signals, plus an MCP-powered workflow that captures developer activity into structured updates. TicketWise (Aug 2023 to Oct 2023) is the backend for a ticket reservation system using message-queue async workflows and OpenSearch-based retrieval to reduce query latency.",
    category: "projects",
    priority: 9,
  },
  {
    question: "How can I contact him?",
    answer:
      "The best way to reach Sharan is by email at sharandeepak32@gmail.com. The page also surfaces Email me and Contact me buttons for direct outreach, and his phone number on the resume is +91 9940579219. He is based in Chennai, India, prefers Chennai, Bangalore, or Hyderabad, has a negotiable 15 to 30 day notice period, and is open to relocation based on the opportunity.",
    category: "contact",
    priority: 10,
  },
  {
    question: "Why should we hire him?",
    answer:
      "Sharan brings strong backend expertise along with end-to-end ownership. He does not just build features; he focuses on scalability, performance, and real user impact, with measurable results like a 60% dashboard load reduction, roughly 40% engagement lift, and products serving 300,000+ active users.",
    category: "hr",
    priority: 11,
  },
  {
    question: "Why is he looking for a new opportunity?",
    answer:
      "He is looking to take on broader ownership and solve more complex, high-impact problems. After building and scaling key features end-to-end, he wants to contribute at a level where he can drive larger technical decisions and continue growing as a backend-focused engineer.",
    category: "hr",
    priority: 12,
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main(): Promise<void> {
  const db = getFirestore();
  if (!db) {
    console.error(
      "[seed] Firebase is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local before running pnpm seed."
    );
    process.exit(1);
  }

  const collection = db.collection("suggested_questions");
  let written = 0;

  for (const q of QUESTIONS) {
    const id = slugify(q.question);
    const ref = collection.doc(id);
    const snapshot = await ref.get();

    const baseDoc = {
      id,
      question: q.question,
      answer: q.answer,
      category: q.category,
      priority: q.priority,
      isActive: true,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (snapshot.exists) {
      await ref.set(baseDoc, { merge: true });
    } else {
      await ref.set(
        { ...baseDoc, createdAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    written += 1;
    console.log(`[seed] upserted ${id}`);
  }

  console.log(`[seed] done. wrote ${written} suggested questions.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
