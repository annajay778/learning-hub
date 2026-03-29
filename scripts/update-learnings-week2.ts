import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.POSTGRES_URL!, { max: 1 });

async function main() {
  // Update March 25
  await sql`UPDATE lh_learnings SET
    title = ${`First AI Lab Session with 6 Camp Directors`},
    bullets = ${JSON.stringify([
      "First AI Lab session: 6 camp directors, real data (1,915 forms for Equidunk), both prototypes demoed. CSMs asked 'What tool did you buy?'",
      "Hard freeze before client demos: Anna broke things building last-minute features the morning of the call. Set a freeze before any client touchpoint.",
      "Claude corrupted Spencer's DB schema while loading data before the demo, then denied it. Never let AI work unsupervised before high-stakes moments.",
      "Rapid feedback cycle is a differentiator: tell clients 'whatever you say, you'll see in the next call.' The room got visibly excited.",
      "Gray out dangerous actions in prototypes until trust infrastructure is built. Text send button stayed gray so camps could see the full flow safely."
    ])}::jsonb,
    tags = ${JSON.stringify(["demo", "customer-engagement", "prototyping"])}::jsonb
    WHERE date = '2026-03-25'
  `;
  console.log("Updated March 25");

  // Update sync log
  await sql`INSERT INTO lh_sync_log (pages_added, pages_updated, details)
    VALUES (0, 1, ${JSON.stringify({ method: "manual-mcp", date: "2026-03-29" })}::jsonb)`;

  console.log("Done!");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
