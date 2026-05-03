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
    | "mobile"
    | "hr";
  title: string;
  body: string;
  keywords: string[];
}

export const PROFILE_SUMMARY: string =
  "Sharan Deepak R B is a backend-focused software engineer based in Chennai, currently working as a Software Developer at SurveySparrow with 3 years of experience. He builds and scales 0 to 1 product features for 300,000+ active users, with strengths in backend architecture, API design, database modeling, performance optimization, end-to-end ownership, and mentoring small teams. Key impact: 300,000+ active users across 250+ paying customers, shipped the One-on-Ones module 0 to 1, cut dashboard load by 60% with Elasticsearch, lifted portal engagement by roughly 40% via Slack-driven workflows, and raised backend AI agent readiness from 0% to 85%. For HR-style answers, use a concise, recruiter-friendly, confident tone based only on verified profile data. Contact via sharandeepak32@gmail.com.";

export const PROFILE_CHUNKS: ProfileChunk[] = [
  {
    id: "exp-surveysparrow",
    category: "experience",
    title: "SurveySparrow, Software Developer (2023 to Present)",
    body: "At SurveySparrow in Chennai, Sharan works as a Software Developer and leads backend for employee engagement products serving 300,000+ active users across 250+ paying customers, with enterprise deployments reaching 50,000 employees. He built and launched the One-on-Ones module from 0 to 1, owning architecture, API design, schema, services, and rollout. He also developed the Reward Marketplace covering redemption workflows, voucher lifecycle management, and third-party vendor integrations.",
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
    title: "Internships: Growfin and Zoho",
    body: "Sharan did internships at Growfin and Zoho Corporation in Chennai. At Growfin (Jan 2023 to June 2023), he worked as a Backend Development Intern, building an internal SDK for CRM service communication and shipping cron-based automation, queue-driven processing, and cache-backed services. Earlier, from May 2022 to June 2022, he was a Summer Intern at Zoho Corporation.",
    keywords: [
      "growfin",
      "zoho",
      "intern",
      "interns",
      "internship",
      "internships",
      "where internship",
      "summer intern",
      "backend development intern",
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
    body: "Programming languages Sharan knows: TypeScript, C++, Java, Dart, and JavaScript. He also works with SQL. Frameworks and APIs: Spring Boot, REST API, API Design, Backend Architecture, and Database Modeling. Datastores and search: PostgreSQL, Redis, Elasticsearch, SQL, and OpenSearch. Frontend and mobile: HTML, CSS, and Flutter. Infrastructure: Docker and Git. Foundations: DBMS, OOPS, and Data Structures. AI engineering: LLM-friendly repository setup, AI agent readiness, sub-agent workflows, and rules/hooks for AI-assisted development.",
    keywords: [
      "language",
      "languages",
      "programming",
      "programming language",
      "programming languages",
      "knows",
      "learned",
      "skills",
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
    body: "Goal Assist (Aug 2025 to Oct 2025) is an AI-powered productivity platform that helps developers communicate progress clearly while giving managers a structured view to review, prioritize, and track work. It includes a manager dashboard centralizing priorities, task progress, and execution signals, plus an MCP-powered workflow that captures developer activity and converts it into structured updates. It reduced manual task filling and repetitive standup reporting.",
    keywords: [
      "goal assist",
      "ai",
      "productivity",
      "mcp",
      "manager",
      "dashboard",
      "priorities",
      "developer activity",
      "standup",
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
    title: "Contact and availability",
    body: "Email: sharandeepak32@gmail.com. Phone: +91 9940579219. Location: Chennai, India. Preferred locations are Chennai, Bangalore, and Hyderabad. Notice period is 15 to 30 days and negotiable. Earliest joining date is ASAP. Salary details should be discussed directly with Sharan. He is open to relocating based on the opportunity. The page also exposes Email me and Contact me buttons for direct outreach.",
    keywords: [
      "contact",
      "email",
      "phone",
      "chennai",
      "india",
      "reach",
      "hire",
      "notice",
      "availability",
      "salary",
      "relocate",
      "relocation",
      "bangalore",
      "hyderabad",
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
    body: "On mobile, Sharan works with Flutter and Dart. At SurveySparrow he mentored a 3-person team by guiding implementation, reviewing contributions, and driving delivery across mobile and backend initiatives.",
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
  {
    id: "hr-positioning",
    category: "hr",
    title: "HR positioning and target roles",
    body: "Sharan is currently working as a Software Developer at SurveySparrow. Verified target-role information in the current profile data is not available beyond his backend-focused software engineering positioning.",
    keywords: [
      "current",
      "status",
      "role",
      "roles",
      "looking",
      "opportunity",
      "motivation",
      "why change",
      "why looking",
      "software developer",
      "backend developer",
      "full stack",
      "product engineer",
    ],
  },
  {
    id: "hr-why-software-strengths",
    category: "hr",
    title: "Why software and professional strengths",
    body: "Sharan chose software development because he is passionate about building products that solve real-world problems, turning ideas into working software, and seeing the impact on users. His top strengths are backend architecture and scalability, end-to-end ownership, and performance optimization/problem-solving. A strong example is reducing dashboard load time by roughly 60% by replacing SQL-heavy workflows with optimized Elasticsearch queries.",
    keywords: [
      "why software",
      "why field",
      "strength",
      "strengths",
      "backend architecture",
      "scalability",
      "ownership",
      "performance",
      "problem solving",
      "impact",
      "hire",
    ],
  },
  {
    id: "hr-team-leadership-workstyle",
    category: "hr",
    title: "Teamwork, leadership, and work style",
    body: "Sharan works as a collaborative and ownership-driven team member with clear communication and stakeholder alignment. On the One-on-Ones module, he worked with product managers on requirements, designers on workflows, frontend and mobile developers on integration, and teammates through mentoring and code reviews. His work style is to break work into clear tasks, prioritize by impact and deadlines, align early with stakeholders, keep progress visible, deliver a working version first, and communicate trade-offs proactively under pressure.",
    keywords: [
      "teamwork",
      "team",
      "collaboration",
      "leadership",
      "ownership",
      "one-on-ones",
      "mentor",
      "code review",
      "deadline",
      "pressure",
      "work style",
      "communication",
    ],
  },
  {
    id: "hr-common-answers",
    category: "hr",
    title: "Common HR answers",
    body: "For 'Why should we hire you?', answer: I bring strong backend expertise along with end-to-end ownership. I do not just build features; I focus on scalability, performance, and real user impact, which has helped me deliver measurable results like improving performance and engagement in production systems. For 'Why this role?', answer: This role aligns well with my strengths in backend engineering and building scalable systems. I am looking for an opportunity where I can work on meaningful problems and contribute at a larger scale. For motivation, answer that Sharan is motivated by solving real-world problems, improving system performance, and seeing production impact.",
    keywords: [
      "why hire",
      "hire you",
      "why should we hire",
      "why this role",
      "salary expectations",
      "motivation",
      "motivates",
      "different",
      "differentiator",
      "deadline",
      "team",
      "relocate",
    ],
  },
  {
    id: "hr-career-goals-learning-personal",
    category: "hr",
    title: "Career goals, learning, and personal interests",
    body: "Verified profile data confirms Sharan has used MCP-powered workflows for AI-powered developer productivity and has experience with Flutter and Dart. Additional verified information about career goals, recent mobile learning, or personal interests is not available in the current profile data.",
    keywords: [
      "career goals",
      "where do you see",
      "2 years",
      "3 years",
      "learning",
      "recently learned",
      "mcp",
      "music",
      "piano",
      "personal",
      "hobby",
      "hobbies",
      "interests",
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

function tokenVariants(token: string): string[] {
  const variants = new Set([token]);
  if (token.endsWith("ships") && token.length > 5) {
    variants.add(token.slice(0, -1));
  }
  if (token.endsWith("ies") && token.length > 4) {
    variants.add(`${token.slice(0, -3)}y`);
  }
  if (token.endsWith("s") && token.length > 3) {
    variants.add(token.slice(0, -1));
  }
  if (token.endsWith("ed") && token.length > 4) {
    variants.add(token.slice(0, -2));
  }
  return Array.from(variants);
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
      const variants = tokenVariants(tok);
      const matched = variants.some((variant) => haystackTokens.has(variant));
      if (matched) {
        const keywordHits = variants.some((variant) => keywordSet.has(variant)) ? 1 : 0;
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
