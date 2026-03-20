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
      module_slug TEXT,
      notion_page_id TEXT UNIQUE,
      notion_last_edited TIMESTAMP,
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  console.log("Creating lh_sync_log table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_sync_log (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      synced_at TIMESTAMP DEFAULT NOW() NOT NULL,
      pages_added INTEGER NOT NULL DEFAULT 0,
      pages_updated INTEGER NOT NULL DEFAULT 0,
      details JSONB
    )
  `;

  console.log("Creating lh_page_snapshots table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_page_snapshots (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      page_id UUID REFERENCES lh_pages(id) ON DELETE CASCADE NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      snapshot_at TIMESTAMP DEFAULT NOW() NOT NULL,
      change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'manual_edit'))
    )
  `;

  console.log("Creating lh_coach_notes table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_coach_notes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      author TEXT NOT NULL DEFAULT 'Stephanie',
      body TEXT NOT NULL,
      reviewed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  console.log("Creating lh_demo_links table...");
  await sql`
    CREATE TABLE IF NOT EXISTS lh_demo_links (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;

  // Add new columns to existing lh_pages table (safe if already exists)
  console.log("Adding columns to lh_pages (if missing)...");
  await sql`
    DO $$ BEGIN
      ALTER TABLE lh_pages ADD COLUMN notion_page_id TEXT UNIQUE;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE lh_pages ADD COLUMN notion_last_edited TIMESTAMP;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE lh_pages ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE lh_pages ADD COLUMN module_slug TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$
  `;

  console.log("Seeding categories...");
  const categories = [
    { name: "Outreach", color: "#3B82F6" },
    { name: "Onboarding", color: "#10B981" },
    { name: "Data", color: "#F59E0B" },
    { name: "Internal Process", color: "#8B5CF6" },
    { name: "Technical", color: "#0EA5E9" },
    { name: "Content", color: "#EC4899" },
    { name: "Strategy", color: "#6366F1" },
    { name: "Planning", color: "#F97316" },
    { name: "Prototype", color: "#14B8A6" },
  ];

  for (const cat of categories) {
    await sql`
      INSERT INTO lh_categories (name, color)
      VALUES (${cat.name}, ${cat.color})
      ON CONFLICT (name) DO NOTHING
    `;
  }

  // Assign modules to existing pages based on title patterns
  console.log("Assigning modules to existing pages...");
  const moduleAssignments = [
    { pattern: "%Technical Setup%", slug: "getting-set-up" },
    { pattern: "%Environment%", slug: "getting-set-up" },
    { pattern: "%Working with an AI Engineer%", slug: "working-with-ai-engineer" },
    { pattern: "%AI Engineer%", slug: "working-with-ai-engineer" },
    { pattern: "%Move Fast%", slug: "moving-fast" },
    { pattern: "%Moving Fast%", slug: "moving-fast" },
    { pattern: "%Product Discovery%", slug: "discovery-with-ai" },
    { pattern: "%Discovery with AI%", slug: "discovery-with-ai" },
    { pattern: "%Customer Engagement%", slug: "customer-engagement" },
    { pattern: "%Beta%", slug: "customer-engagement" },
    { pattern: "%Mistake%", slug: "mistakes" },
    { pattern: "%Course Correction%", slug: "mistakes" },
    { pattern: "%Prototype Hub%", slug: "prototypes" },
    { pattern: "%Architecture%", slug: "prototypes" },
    { pattern: "%Extra Playbook%", slug: "prototypes" },
  ];

  for (const { pattern, slug } of moduleAssignments) {
    const result = await sql`
      UPDATE lh_pages
      SET module_slug = ${slug}
      WHERE title LIKE ${pattern}
        AND module_slug IS NULL
        AND type = 'playbook'
    `;
    if (result.count > 0) {
      console.log(`  Assigned ${result.count} page(s) to "${slug}" via "${pattern}"`);
    }
  }

  console.log("Done! All tables created and seeded.");
  await sql.end();
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
