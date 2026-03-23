import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

const learnings = [
  {
    date: "2026-03-20",
    title: "Demo Day: Two working prototypes in 4 days",
    bullets: [
      "Smart Nudge: AI-drafted text notifications for 23 missing-forms families, with preview/edit and send via Twilio",
      "Parent Handbook: Full chatbot with live topic categorization, confidence scoring, guardrails, and Campminder API integration",
      "Beta outreach sent to 6 camps — Green Acres and Fred's Camp confirmed within hours",
      "Twilio technical ownership handed to Spencer; Anna focuses on client relationships and beta management",
      "OpenAI BAA approved — unblocks personalized AI responses using real camper data",
    ],
    tags: ["prototyping", "demo", "customer-engagement", "infrastructure"],
    author: "AI-generated from daily notes",
  },
  {
    date: "2026-03-19",
    title: "From zero to build-ready in one pairing session",
    bullets: [
      "RAG fundamentals: how chunking, embedding, and vector databases work together — chunking strategy is the core design decision",
      "Full dev environment set up: VS Code, Neon Postgres, Blob Storage, Vercel, GitHub — all in one afternoon",
      "Spencer's workflow: /workflow-brainstorm → /workflow-plan → /workflow-work → /workflow-review → /workflow-compound (each step teaches Claude more about the project)",
      "The 'senior engineer review' trick: tell Claude to review as a 20-year veteran — it catches things it missed during the build",
      "Kevin's data access shortcut: capture the AJAX call from Campminder reports, stub the response, build full UI against real data shape",
    ],
    tags: ["setup", "workflow", "tips"],
    author: "AI-generated from daily notes",
  },
  {
    date: "2026-03-18",
    title: "Direction locked: Smart Nudges + AI Handbook",
    bullets: [
      "Validated across 55 sources, CMC data, internal camp director feedback, and Attention call analysis",
      "Internal brainstorm with 10 camp directors: Smart Nudges won 5 votes, Camp in Your Pocket 2, AI Handbook 1",
      "Smart Nudges: proactive text/email nudges with AI-drafted messages that adjust urgency over time",
      "AI Handbook: RAG-based parent chatbot answering questions from uploaded camp handbooks",
      "Anna transitions to 100% AI Lab; Erica confirmed as primary design partner for ATS + Placement",
    ],
    tags: ["strategy", "decision", "validation"],
    author: "AI-generated from daily notes",
  },
  {
    date: "2026-03-17",
    title: "Form validator hits 99% accuracy; 5 AI options on the table",
    bullets: [
      "Spencer's form validator prototype: processes handwritten camp health forms with 99% accuracy using AI vision",
      "Presented 5 AI initiative options to Scott, Mary, Spencer, and Janelle — narrowing to final direction by March 18",
      "Kevin aligned on 'computer use' (browser automation) architecture for future chatbot data access",
      "Anna gained GitHub repo access and learned Git fundamentals in one pairing session with Spencer",
      "Two camp adoption segments identified: early adopters who want AI yesterday vs. conservatives who prefer manual control",
    ],
    tags: ["prototyping", "strategy", "architecture"],
    author: "AI-generated from daily notes",
  },
  {
    date: "2026-03-16",
    title: "AI Lab kicks off",
    bullets: [
      "Anna + Spencer begin a 4-6 week sprint to build and ship AI-powered tools to real camps",
      "Daily standups at 9:45 AM in Slack channel 'epic AI standup' — first customer usage target is April 1",
      "Operating principle established: 'Build for speed, not scale' — prototypes will look shippable but aren't, plan replacement before next summer",
      "Staff Placement shipped to first 30 clients last Friday; within 3 hours, #1 request was a feature the team had deprioritized",
      "Playbook to be published by April 29 with two teachback sessions for the broader org",
    ],
    tags: ["kickoff", "timeline", "principles"],
    author: "AI-generated from daily notes",
  },
];

async function main() {
  for (const entry of learnings) {
    await sql`
      INSERT INTO lh_learnings (date, title, bullets, tags, author)
      VALUES (
        ${entry.date},
        ${entry.title},
        ${JSON.stringify(entry.bullets)}::jsonb,
        ${JSON.stringify(entry.tags)}::jsonb,
        ${entry.author}
      )
    `;
    console.log(`Seeded: ${entry.date} — ${entry.title}`);
  }

  await sql.end();
  console.log("Done! 5 learning entries seeded.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
