import postgres from "postgres";
import dotenv from "dotenv";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

// Path to the week plan file
const WEEK_PLAN_PATH = resolve(
  process.env.HOME || "~",
  "Desktop/Home/PersonalOS/Campminder/writing/one_pagers/this-week-plan-and-learning-hub-prompt.md"
);

function extractWeekInfo(content: string) {
  // Extract title from first heading: "# This Week: March 23-28, 2026"
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : "This Week";

  // Parse the first "Month Day" from the title to build a real date
  const months: Record<string, string> = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12",
  };
  const dateMatch = title.match(
    new RegExp(`(${Object.keys(months).join("|")})\\s+(\\d+)`)
  );
  const yearMatch = title.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : "2026";
  const month = dateMatch ? months[dateMatch[1]] : "03";
  const day = dateMatch ? dateMatch[2].padStart(2, "0") : "16";
  const weekStart = `${year}-${month}-${day}`;

  return { title, weekStart };
}

async function main() {
  if (!existsSync(WEEK_PLAN_PATH)) {
    console.log(`Week plan file not found at: ${WEEK_PLAN_PATH}`);
    console.log("Skipping week plan sync.");
    await sql.end();
    return;
  }

  const content = readFileSync(WEEK_PLAN_PATH, "utf-8");
  const { title, weekStart } = extractWeekInfo(content);

  // Strip the prompt section at the bottom (everything after "## Prompt:")
  const promptIdx = content.indexOf("## Prompt:");
  const body = (promptIdx >= 0 ? content.slice(0, promptIdx) : content).trim();

  // Upsert: update if same week_start exists, otherwise insert
  const existing = await sql`
    SELECT id FROM lh_weekly_plans WHERE week_start = ${weekStart} LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE lh_weekly_plans
      SET title = ${title}, body = ${body}, updated_at = NOW()
      WHERE week_start = ${weekStart}
    `;
    console.log(`Updated week plan: ${title}`);
  } else {
    await sql`
      INSERT INTO lh_weekly_plans (week_start, title, body)
      VALUES (${weekStart}, ${title}, ${body})
    `;
    console.log(`Created week plan: ${title}`);
  }

  await sql.end();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
