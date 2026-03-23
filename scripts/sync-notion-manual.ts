import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function upsert(notionPageId: string, title: string, body: string, type: "playbook" | "learning", author: string) {
  const existing = await sql`SELECT id FROM lh_pages WHERE notion_page_id = ${notionPageId} LIMIT 1`;

  if (existing.length > 0) {
    await sql`
      UPDATE lh_pages SET title = ${title}, body = ${body}, updated_at = NOW(), notion_last_edited = NOW()
      WHERE notion_page_id = ${notionPageId}
    `;
    console.log(`  Updated: ${title}`);
    return "updated";
  }

  await sql`
    INSERT INTO lh_pages (title, body, type, author, notion_page_id, notion_last_edited, source)
    VALUES (${title}, ${body}, ${type}, ${author}, ${notionPageId}, NOW(), 'notion')
  `;
  console.log(`  Created: ${title}`);
  return "created";
}

async function main() {
  let added = 0;
  let updated = 0;

  // Day 8 learning entry - add to lh_learnings feed
  console.log("Adding Day 8 learning entry...");
  const day8Exists = await sql`SELECT id FROM lh_learnings WHERE date = '2026-03-23' LIMIT 1`;
  if (day8Exists.length === 0) {
    await sql`
      INSERT INTO lh_learnings (date, title, bullets, tags, author)
      VALUES (
        '2026-03-23',
        'Day 8: ZDR Workaround, Twilio Resubmission & Beta Pipeline',
        ${JSON.stringify([
          "OpenAI Zero Data Retention (ZDR) breaking multi-round tool calls — responses API can't persist function call items between rounds",
          "Twilio A2P campaign resubmitted after fixing access to opt-in proof screenshots — brand registration approved (TCR ID: B7FGEDZ)",
          "Beta pipeline: 3 confirmed (Green Acres, Fred's Camp, Tall Pines), 3 pending, 1 pricing concern — targeting Wednesday demos",
          "Parent handbook prototype loaded onto Learning Hub site",
          "Database access conversation with David Whitehurst initiated — gating factor for real data in demos"
        ])}::jsonb,
        ${JSON.stringify(["infrastructure", "prototyping", "customer-engagement"])}::jsonb,
        'AI-generated from daily notes'
      )
    `;
    console.log("  Created Day 8 learning entry");
  } else {
    console.log("  Day 8 entry already exists, skipping");
  }

  // Parent Handbook AI prototype doc
  console.log("Syncing Parent Handbook AI...");
  const handbookBody = `*Feature-complete multi-tenant handbook chatbot with agentic RAG, conversation intelligence, confidence scoring, guardrails, and CampMinder person context.*

## The Problem
Camp directors distribute parent handbooks (PDFs, docs) with critical info — packing lists, pickup times, medical policies. Parents don't read them, then flood camp offices with questions.

## What Was Built (7 sessions)
1. **Session 1:** Multi-tenant architecture — admin sign in, create camps, upload docs, configure chatbot, share chat link. Parents visit chat page, ask questions, get markdown-formatted answers.
2. **Session 2:** PM mockup-driven redesign, conversation search, custom branding per camp, self-verification via screenshots
3. **Session 3:** CampMinder design matching — made the dashboard look like a native CampMinder module
4. **Session 4:** Agentic RAG pipeline (input guardrails → tool-based multi-search → streaming), conversation intelligence dashboard (auto-categorization, confidence, feedback)
5. **Session 5:** RAG quality hardening — 30+ manual tests against real 60-page handbook, confidence-driven model behavior, strict guardrail enforcement
6. **Session 6:** CampMinder person context — parents identify themselves, AI personalizes answers using real enrollment data via hybrid sync + pre-chat gate
7. **Session 7:** Sync-first resilience pattern — local synced data as baseline, live API as optional enrichment

## Key Patterns
- **PM screenshots as prompt context** — one set of images shaped naming, layout, and content decisions across multiple files
- **"What's NOT done" > "What did you build"** — forces honest audit of gaps
- **Guardrails are sacred** — camp-configured rules enforced exactly as written, code never adds exceptions
- **Test in the browser, not the API** — Chrome-based testing caught 5+ UX bugs curl would miss
- **Sync-first, enrich later** — local data is reliable baseline, live API calls are optional enrichment wrapped in Promise.allSettled

## Status
Feature-complete for demo. Admin dashboard, conversation intelligence, CampMinder integration all working. Ready for broader testing with real camp handbooks.`;

  const r1 = await upsert("327d23fa124b8174a9e2edbcf7e778aa", "Parent Handbook AI — Build Playbook", handbookBody, "playbook", "Spencer");
  if (r1 === "created") added++; else if (r1 === "updated") updated++;

  // AI Form Validator
  console.log("Syncing AI Form Validator...");
  const validatorBody = `*End-to-end form validation: upload → AI vision validation → AI-generated SMS → parent reply → revalidation. 65 tests passing.*

## How It Works
1. Parent uploads a photo of a camp form (health history, immunization, physical exam, waiver)
2. GPT-5.4 validates every field via vision API + structured output (generateObject + Zod)
3. If issues found → AI writes a warm, specific SMS ("It looks like the parent signature may be missing from Olivia's health form")
4. Parent replies with corrected photo → webhook receives → AI re-validates
5. Staff dashboard shows all submissions with timeline, filters, manual approve

## Key Technical Decisions
- **Dynamic field detection** — AI reads the form itself to determine what fields exist, no hardcoded checklist
- **AI-generated SMS > templates** — GPT-5.4 writes the parent-facing message as part of validation, one call
- **Starter pack carried the weight** — Vercel AI SDK + Drizzle + Zod + shadcn meant building product, not infrastructure
- **Mock mode essential** — Twilio mock mode (console logging) enables full flow testing without credentials

## Build Timeline
- Phase 0: 30 min research challenging the PRD (caught 6 incorrect assumptions)
- Phase 1-3: Planning + TDD implementation (9 tasks, 56 tests)
- Phase 4: Runtime debugging (deferred DB, Blob access, OpenAI image format)
- Phase 5: AI SMS generation + demo readiness
- Phase 6: Validation prompt rewrite — dynamic schema replacing hardcoded field lists

## Lessons Learned
- Start with research, not code — 30 min challenging the PRD saved hours of rework
- Runtime bugs hide behind mocked tests — the three hardest bugs only appeared running the real app
- The integration seam is the product boundary — one POST endpoint, everything else is internal

## Status
65 tests passing, zero lint warnings. Live SMS gated by Twilio A2P compliance approval.`;

  const r2 = await upsert("327d23fa124b8167aebedab4eb61b09f", "AI Form Validator — Build Playbook", validatorBody, "playbook", "Spencer");
  if (r2 === "created") added++; else if (r2 === "updated") updated++;

  // CampMinder API Builder
  console.log("Syncing CampMinder API Builder...");
  const apiBody = `*CampMinder REST API packaged into a Claude Code plugin — 7 services, 26 endpoints, ready for first real usage.*

A Claude Code skill that gives Claude direct knowledge of the CampMinder REST API surface. Includes correct required params, enums, and a "things that will be wrong" table for known API quirks.`;

  const r3 = await upsert("327d23fa124b807fa134ea0322365392", "CampMinder API Builder CC Plugin", apiBody, "playbook", "Spencer");
  if (r3 === "created") added++; else if (r3 === "updated") updated++;

  // Log the sync
  await sql`
    INSERT INTO lh_sync_log (pages_added, pages_updated, details)
    VALUES (${added}, ${updated}, ${JSON.stringify({ method: "manual-mcp", synced_at: new Date().toISOString() })}::jsonb)
  `;

  console.log(`\nSync complete: ${added} added, ${updated} updated`);
  await sql.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
