export interface ProfileChunk {
  id: string;
  category:
    | "experience"
    | "skills"
    | "projects"
    | "achievements"
    | "education"
    | "contact"
    | "awards"
    | "ai-workflows"
    | "mobile";
  title: string;
  body: string;
  keywords: string[];
}

export const PROFILE_SUMMARY: string =
  "Sharan Deepak R B is a backend-focused software engineer based in Chennai, working as a Software Developer at SurveySparrow with 3 years of experience. He is positioned as a Senior Product Developer / Backend-focused Full Stack Developer with strengths in backend architecture, API design, database modeling, performance optimization, and mentoring small teams. Key impact: 300,000+ active users across 250+ paying customers, shipped the One-on-Ones module 0 to 1, cut dashboard load by 60% with Elasticsearch, lifted portal engagement by roughly 40% via Slack-driven workflows, and raised backend AI agent readiness from 0% to 85%. Contact via sharandeepak32@gmail.com.";

export const PROFILE_CHUNKS: ProfileChunk[] = [
  {
    id: "exp-surveysparrow",
    category: "experience",
    title: "SurveySparrow, Software Developer (2023 to Present)",
    body: "At SurveySparrow in Chennai, Sharan leads backend for employee engagement products serving 300,000+ active users across 250+ paying customers, with enterprise deployments reaching 50,000 employees. He built and launched the One-on-Ones module 0 to 1, owning architecture, API design, schema, services, and rollout. He also developed the Reward Marketplace covering redemption workflows, voucher lifecycle management, and third-party vendor integrations.",
    keywords: [
      "surveysparrow",
      "backend",
      "employee engagement",
      "one-on-ones",
      "0 to 1",
      "reward marketplace",
      "voucher",
      "enterprise",
      "300000",
      "scalable",
      "api",
      "schema",
    ],
  },
  {
    id: "exp-surveysparrow-impact",
    category: "experience",
    title: "SurveySparrow, performance and engagement impact",
    body: "Sharan reduced dashboard load by 60% by replacing SQL-heavy workflows with optimized Elasticsearch queries. He grew portal engagement by roughly 40% via Slack-based workflows, webhooks, and event-driven backend integrations. He mentored a 3-person team across mobile and backend.",
    keywords: [
      "elasticsearch",
      "performance",
      "60%",
      "dashboard",
      "slack",
      "webhooks",
      "event-driven",
      "engagement",
      "40%",
      "mentor",
      "scalable",
      "optimization",
    ],
  },
  {
    id: "exp-growfin-zoho",
    category: "experience",
    title: "Earlier roles: Growfin and Zoho",
    body: "At Growfin in Chennai (Jan 2023 to June 2023), Sharan worked as a Backend Development Intern, building an internal SDK for CRM service communication and shipping cron-based automation, queue-driven processing, and cache-backed services. Earlier in May to June 2022 he was a Summer Intern at Zoho Corporation in Chennai.",
    keywords: [
      "growfin",
      "zoho",
      "intern",
      "sdk",
      "crm",
      "cron",
      "queue",
      "cache",
      "backend",
      "automation",
    ],
  },
  {
    id: "skills-core",
    category: "skills",
    title: "Core technical skills",
    body: "Languages and platforms: TypeScript, C++, Java, JavaScript, Dart, SQL. Frameworks and APIs: Spring Boot, REST API. Datastores: PostgreSQL, Redis, ElasticSearch. Infrastructure: Docker, Git. Foundations: DBMS, OOPS, Data Structures. Web basics: HTML, CSS.",
    keywords: [
      "typescript",
      "java",
      "c++",
      "javascript",
      "spring boot",
      "postgresql",
      "redis",
      "elasticsearch",
      "docker",
      "rest",
      "sql",
      "git",
      "dbms",
      "oops",
      "data structures",
    ],
  },
  {
    id: "projects-goal-assist",
    category: "projects",
    title: "Goal Assist (2025)",
    body: "Goal Assist (Aug 2025 to Oct 2025) is an AI-powered productivity platform. It includes a manager dashboard surfacing priorities, task progress, and execution signals, plus an MCP-powered workflow that captures developer activity and turns it into structured updates.",
    keywords: [
      "goal assist",
      "ai",
      "productivity",
      "mcp",
      "manager",
      "dashboard",
      "priorities",
      "developer activity",
      "2025",
    ],
  },
  {
    id: "projects-ticketwise",
    category: "projects",
    title: "TicketWise (2023)",
    body: "TicketWise (Aug 2023 to Oct 2023) is the backend for a ticket reservation system. It uses message-queue async workflows for booking and notifications, and OpenSearch-based retrieval to reduce query latency on ticket lookups.",
    keywords: [
      "ticketwise",
      "ticket",
      "reservation",
      "message queue",
      "async",
      "opensearch",
      "latency",
      "backend",
      "2023",
    ],
  },
  {
    id: "education",
    category: "education",
    title: "Education",
    body: "BTech in Information Technology from Easwari Engineering College (2019 to 2023), CGPA 9.0/10.0.",
    keywords: [
      "btech",
      "information technology",
      "easwari",
      "engineering",
      "cgpa",
      "9.0",
      "education",
      "degree",
    ],
  },
  {
    id: "contact",
    category: "contact",
    title: "Contact",
    body: "Email: sharandeepak32@gmail.com. Phone: +91 9940579219. Location: Chennai, India. The page also exposes Email me and Contact me buttons for direct outreach.",
    keywords: [
      "contact",
      "email",
      "phone",
      "chennai",
      "india",
      "reach",
      "hire",
      "sharandeepak32",
    ],
  },
  {
    id: "awards",
    category: "awards",
    title: "Awards and recognitions",
    body: "Bug Buster Award at Growfin (2023). Gold Medal from the IG of Southern Railways for developing a smart attendance system (2022). Rank 284 of 24,841 participants in the CodeChef March Long Challenge (2022). 3rd place out of 147 teams at the Tamil Nadu Police Hackathon (2020). Certifications include Full Stack Development with React and Node JS (GeeksforGeeks, 2022), Art of Ethical Hacking Through Programming (SelfMadeNinja, 2021), and The Complete Android Development Bootcamp (Udemy, 2021).",
    keywords: [
      "award",
      "bug buster",
      "gold medal",
      "codechef",
      "hackathon",
      "tamil nadu police",
      "rank",
      "certification",
      "geeksforgeeks",
      "udemy",
    ],
  },
  {
    id: "ai-workflows",
    category: "ai-workflows",
    title: "AI tooling and agentic workflows",
    body: "Sharan raised backend AI agent readiness from 0% to 85% by introducing LLM-friendly rules, hooks, and sub-agent workflows in the SurveySparrow backend repository. He led internal sessions on automating dev tasks with LLMs. On Goal Assist he built an MCP-powered workflow that captures developer activity into structured updates.",
    keywords: [
      "ai",
      "llm",
      "agent",
      "agentic",
      "85%",
      "mcp",
      "sub-agent",
      "hooks",
      "rules",
      "automation",
      "developer productivity",
    ],
  },
  {
    id: "mobile",
    category: "mobile",
    title: "Mobile work",
    body: "On mobile, Sharan works with Flutter and Dart from his core skill set. At SurveySparrow he mentored a 3-person team that spans mobile and backend, coordinating delivery across both surfaces.",
    keywords: [
      "mobile",
      "flutter",
      "dart",
      "android",
      "app",
      "mentor",
      "cross-platform",
    ],
  },
];

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/\W+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

export function retrieveChunks(
  query: string,
  opts?: { topK?: number }
): ProfileChunk[] {
  const topK = opts?.topK ?? 3;
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return PROFILE_CHUNKS.slice(0, topK);
  }

  const scored = PROFILE_CHUNKS.map((chunk, index) => {
    const haystackTokens = new Set(
      tokenize(chunk.body + " " + chunk.keywords.join(" "))
    );
    const keywordSet = new Set(
      chunk.keywords.flatMap((k) => tokenize(k))
    );

    let score = 0;
    for (const tok of tokens) {
      if (haystackTokens.has(tok)) {
        const keywordHits = keywordSet.has(tok) ? 1 : 0;
        score += 1 + 2 * keywordHits;
      }
    }
    return { chunk, score, index };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  const top = scored.filter((s) => s.score > 0).slice(0, topK);
  if (top.length === 0) {
    return PROFILE_CHUNKS.slice(0, topK);
  }
  return top.map((s) => s.chunk);
}

export function buildContextBlock(
  query: string,
  opts?: { topK?: number }
): string {
  const chunks = retrieveChunks(query, opts);
  const sections = chunks.map(
    (c) => `### ${c.title}\n${c.body}`
  );
  return [
    "## Profile summary",
    PROFILE_SUMMARY,
    "",
    "## Relevant context",
    sections.join("\n\n"),
  ].join("\n");
}
