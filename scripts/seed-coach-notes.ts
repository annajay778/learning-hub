import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

const notes = [
  {
    author: "Stephanie Tanzar",
    body: `**"Don't wait to bring your team along"**\n\nThe biggest takeaway after seeing Anna's demo day progress: the learning IS the building. Waiting until you've figured it out before sharing means your team never develops the muscle. Bring them into the mess early.`,
    date: "2026-03-18",
  },
  {
    author: "Stephanie Tanzar",
    body: `**"Prototypes don't replace specs"**\n\nInitially believed AI prototyping speed meant PRDs were dead. Changed my mind: Claude needs detailed behavioral specs to build correctly. Prototypes show what's possible; written epics define what to build. Both are essential.`,
    date: "2026-03-20",
  },
  {
    author: "Stephanie Tanzar",
    body: `**"Feature flags change how you demo"**\n\nUsing Cosmic for feature flags means you can overbuild everything behind toggles, then reveal features selectively in live client sessions. One codebase, no separate demo environment. Pair with a "reset data" button for clean slates between sessions.`,
    date: "2026-03-20",
  },
  {
    author: "Stephanie Tanzar",
    body: `**"Your catch-up meetings aren't serving you"**\n\nHour-long sync meetings where half the time is context recap are a sign the collaboration model is wrong. Switch to async Slack + shared repo access for continuous context, then use shorter syncs for decisions only.`,
    date: "2026-03-20",
  },
];

async function main() {
  for (const note of notes) {
    await sql`
      INSERT INTO lh_coach_notes (author, body, created_at)
      VALUES (${note.author}, ${note.body}, ${note.date}::timestamp)
    `;
    console.log(`Seeded: ${note.date} — ${note.body.substring(0, 50)}...`);
  }

  await sql.end();
  console.log("Done! 4 coaching notes seeded.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
