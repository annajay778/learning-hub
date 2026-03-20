import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function setup() {
  console.log("Creating lh_categories table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_categories (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#6B7280',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  console.log("Creating lh_pages table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_pages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      category_id UUID REFERENCES lh_categories(id) ON DELETE SET NULL,
      type TEXT NOT NULL CHECK (type IN ('playbook', 'learning')),
      author TEXT NOT NULL DEFAULT 'Anna',
      pinned BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  console.log("Seeding default categories...");
  const defaults = [
    { name: "Outreach", color: "#3B82F6" },
    { name: "Onboarding", color: "#10B981" },
    { name: "Data", color: "#F59E0B" },
    { name: "Internal Process", color: "#8B5CF6" },
  ];

  for (const cat of defaults) {
    await sql`
      INSERT INTO lh_categories (name, color)
      VALUES (${cat.name}, ${cat.color})
      ON CONFLICT (name) DO NOTHING
    `;
  }

  console.log("Done! Tables created and seeded.");
  await sql.end();
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
