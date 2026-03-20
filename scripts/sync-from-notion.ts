/**
 * One-time sync script — run via: npx tsx scripts/sync-from-notion.ts
 * Uses pre-fetched Notion content (via MCP) to populate the Learning Hub database.
 * Safe to re-run: upserts by notion_page_id.
 */
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

// ── Helpers ─────────────────────────────────────────────────────

async function getCategoryId(name: string): Promise<string | null> {
  const rows = await sql`SELECT id FROM lh_categories WHERE name = ${name} LIMIT 1`;
  return rows[0]?.id ?? null;
}

async function upsertPage(params: {
  notionPageId: string;
  title: string;
  body: string;
  type: "playbook" | "learning";
  author: string;
  categoryName: string | null;
  notionLastEdited: string;
}): Promise<"created" | "updated" | "skipped"> {
  const categoryId = params.categoryName ? await getCategoryId(params.categoryName) : null;

  const existing = await sql`
    SELECT id, notion_last_edited FROM lh_pages
    WHERE notion_page_id = ${params.notionPageId} LIMIT 1
  `;

  if (existing.length === 0) {
    const inserted = await sql`
      INSERT INTO lh_pages (title, body, type, author, category_id, notion_page_id, notion_last_edited, source)
      VALUES (${params.title}, ${params.body}, ${params.type}, ${params.author},
              ${categoryId}, ${params.notionPageId}, ${params.notionLastEdited}, 'notion')
      RETURNING id
    `;
    // Snapshot
    await sql`
      INSERT INTO lh_page_snapshots (page_id, title, body, change_type)
      VALUES (${inserted[0].id}, ${params.title}, ${params.body}, 'created')
    `;
    return "created";
  }

  // Update
  await sql`
    UPDATE lh_pages SET title = ${params.title}, body = ${params.body},
      category_id = ${categoryId}, notion_last_edited = ${params.notionLastEdited},
      updated_at = NOW()
    WHERE id = ${existing[0].id}
  `;
  await sql`
    INSERT INTO lh_page_snapshots (page_id, title, body, change_type)
    VALUES (${existing[0].id}, ${params.title}, ${params.body}, 'updated')
  `;
  return "updated";
}

// ── Content ─────────────────────────────────────────────────────

const PLAYBOOK_SECTIONS = [
  {
    notionPageId: "327d23fa124b8124b83ddcf302358760__working_with_an_ai_engineer",
    title: "Working with an AI Engineer",
    categoryName: "Internal Process",
    body: `*How the PM/engineer dynamic changes when your engineering partner builds with AI at 10x speed.*

On day one, Spencer had already built a working form validator prototype — 99% accuracy on missing field detection, handwritten form photo processing, Twilio SMS notifications — before Anna had even finished analyzing which use case to pursue. That moment rewired how we think about the PM/engineer relationship. The old model was PM specs, engineer builds. The new model is **engineer prototypes, PM steers.** The prototype became the discovery artifact. We showed it at standup on Tuesday and it generated more useful feedback in 15 minutes than a one-pager ever would have.

- **Divide by superpowers, not by component.** Anna handles Campminder branding, design iteration (using Claude Chrome to scrub the live app and match styling), stakeholder communication, and scope decisions. Spencer handles AI logic, model selection, API integrations, and infrastructure. Neither waits for the other. The unlock: a PM who learns basic Git (commit vs push, branches, PRs) can directly contribute to the codebase. Anna learned this in one pairing session and was pushing design changes the same day.

- **Your engineer is also your documentarian.** Spencer built an "Update Playbook" command that auto-captures session progress and lessons learned after each Claude Code session. He records every meeting into a structured Notion table. The PM doesn't have to chase the engineer for status — the data capture is baked into the engineer's workflow.

- **Communication cadence: more than standup, less than Slack noise.** By day 2, the 15-minute standup was too short. Both people had too much to share. The solution we're testing: automated daily Slack posts (both post yesterday's work to a shared Notion page, Claude generates a daily plan) plus pairing sessions as needed throughout the day.

- **Know where AI actually belongs — your engineer will tell you.** In a group feedback session, the room assumed "smart nudges" meant AI was determining when to send messages. Spencer stepped in to clarify: AI has no reliable sense of time or urgency, so cadence decisions should be code-driven. AI's role is drafting emails in the camp's tone and generating insights — not scheduling. "AI feature" often means "code feature with one AI component."

- **Splitting build tracks doubles your learning surface.** When two viable concepts exist (nudges and AI handbook), coach Stephanie Tanzar recommended Anna and Spencer each own one track independently. The result: by the end of the sprint, the team will have deep firsthand knowledge of two different problem spaces instead of one.

- **Run Claude in parallel during meetings — it's your most underused productivity pattern.** Anna called this a "10/10" technique after running it live during standup. While Spencer demoed the parent handbook prototype, Anna had Claude in the background scrubbing Salesforce help articles and Campminder documentation. By the time the meeting ended, she had a full execution plan to show.

- **Parallel tracks need a deliberate setup session — budget for it.** Anna and Spencer committed to two independent build tracks on day one, but Anna couldn't actually build until she was provisioned: starter pack, Vercel environment, Neon database, blob storage, and auth all configured. Spencer walked her through it in a single pairing session.`,
  },
  {
    notionPageId: "327d23fa124b8124b83ddcf302358760__technical_setup_and_environment",
    title: "Technical Setup and Environment",
    categoryName: "Technical",
    body: `*Git, APIs, environments, tokens, and the tools you actually need to keep up.*

You don't need to become an engineer. But you do need to learn enough to not be a bottleneck. Anna went from zero Git knowledge to pushing design changes to a shared repo in a single pairing session with Spencer. The learning curve is steep for about 2 hours, then it flattens.

- **Git basics: commit vs push vs branch vs PR.** Commit saves your work locally. Push sends it to GitHub (and triggers a redeploy on Vercel). A branch lets you work without affecting the live prototype. A PR is how you ask your engineer to review before merging. That's it.

- **Claude Code doesn't know about AI development.** The irony: Claude's training data doesn't include recent AI patterns. It defaults to old models and deprecated APIs. You need an MCP server called Context Seven to get current documentation.

- **Claude Chrome vs Claude Desktop: you can only use one at a time.** The desktop app and Chrome extension fight for the same connection. Workaround: fully quit Claude Desktop when doing design iteration with Claude Chrome.

- **Scheduled tasks: use CoWork, not Claude Code cron.** Claude Code cron jobs expire after 3 days (security feature). If you're automating daily workflows, build them as CoWork scheduled tasks instead.

- **Agentic browsers have real security risks.** Hidden prompt injections on web pages can override Claude's instructions and access all open tabs. Always keep your terminal visible to monitor what Claude Chrome is doing.

- **Environment variables never go in GitHub.** Your API keys, auth tokens, and database credentials go in a local \`.env\` file.

- **VS Code is non-negotiable for everyone on the product team.** Specifically because \`.env\` files are invisible in other editors. A PM who can't see and edit their own environment variables is blocked from a whole class of setup tasks.

- **The starter pack workflow: brainstorm → plan → work → review → compound.** Spencer's starter pack includes slash commands for each step. Compound is the step most people skip — it updates Claude's persistent understanding of the project so every future brainstorm and plan is more accurate.

- **Name your cloud resources with initials from day one.** Prefix resource names with the owner's initials (e.g., "AJ-Smart-Nudge"). Simple habit, real organizational payoff.

- **WiFi dependency is a hard kill switch for AI features in camp settings.** Any AI feature requiring real-time API calls is useless at camps without strong facility WiFi. Ask "what happens if there's no internet?" before proposing the concept.

- **External approval processes are invisible critical path items.** Twilio campaign approval stalled the form validator. Start these processes as early as possible — ideally on the same day you decide on the feature direction.

- **AI doesn't understand time — code handles *when*, AI handles *what*.** AI models don't have a reliable internal clock or sense of urgency. A cron job or rules engine handles scheduling, AI handles the drafting and personalization.`,
  },
  {
    notionPageId: "327d23fa124b8124b83ddcf302358760__process_how_to_move_fast",
    title: "Process: How to Move Fast",
    categoryName: "Internal Process",
    body: `*What to skip, what not to skip, and how to stay aligned when everything ships in hours instead of sprints.*

The single biggest process change: we killed the Kanban board. On day one, Anna and Spencer discussed whether to set one up and decided not to. Anna's reasoning was visceral — in traditional sprints, updating stories and keeping everything current consumed half her week. The new approach: capture data comprehensively (playbook docs, meeting transcripts, daily notes), shape it into whatever form is needed later.

- **"Build for speed, not scale" — say it loudly and often.** This became the mantra after Kevin McKeever warned that stakeholders will see a working prototype and want to ship it to everyone. His framing: "We can use this pig for this summer. We should try to not use this pig for next summer." Every prototype is disposable. Say so before anyone gets attached.

- **Day one is for alignment, not building.** The temptation is to start coding immediately. We didn't. Monday was spent on ROAM risk assessment, interim governance model, ensuring nothing falls through the cracks. Building started Tuesday.

- **Get a coach.** Anna started coaching sessions with Stephanie Tanzar the same week Dan killed the original use case. Having a structured coaching relationship when the project is ambiguous and high-stakes is a forcing function for reflection.

- **Standup format needs constant tuning.** 15 minutes was too short by day 2. We're evolving toward automated daily Slack posts plus a merged standup/alignment meeting. At this pace, your communication rituals from traditional sprints will break. Expect to rebuild them.

- **Your first use case might get killed before you start.** Dan killed the forms project on Friday. By Monday, the team had pivoted to a broader AI Lab with 5 new options. Lesson: always have a wider option set ready.`,
  },
  {
    notionPageId: "327d23fa124b8124b83ddcf302358760__product_discovery_with_ai_tools",
    title: "Product Discovery with AI Tools",
    categoryName: "Internal Process",
    body: `*How AI changes the discovery loop — from research synthesis to prototype testing.*

Anna fed Claude 55 sources in a single day — CMC conference data, competitor release notes (Campfront, CampBrain, UltraCamp, CampDoc), camp director feedback, domain scoring analysis, industry articles. Claude produced 5 scored AI use case options with competitive analysis. This would have taken weeks of manual synthesis. It took hours.

- **Prototypes ARE discovery artifacts.** Spencer's marketing drip campaign tool — built in 9 hours using real UltraCamp API data — expanded the option set beyond what research alone produced. When Scott saw the demo, he said "this is far more than a drip campaign — this is a marketing team in a box." Show, don't spec.

- **Design for the bimodal reaction.** Camp directors split into two clear groups on AI. The early adopters said "I want it tomorrow." The conservatives said "I'd rather answer a thousand emails by hand than get one wrong." Run fast with the growing group, design human-in-the-loop for the conservatives.

- **Physical discovery still matters.** The "camp in your pocket" wild card idea came from Anna physically visiting camps last summer and seeing 3 people in an office out of 3,000 on-site. AI accelerates synthesis, but it can't replace walking the floor.

- **The AI synthesis speed is the capability to demonstrate.** Stephanie Tanzar said the most significant thing Anna had done wasn't the 5 AI options — it was synthesizing 55 sources in a single afternoon. Show stakeholders how fast you got there.

- **When Claude doesn't surface an expected theme, treat the absence as a data point.** Absence of a theme in AI synthesis isn't just noise. It's information about what your data actually contains.

- **Understand RAG well enough to make product decisions about it.** The PM-critical concept is chunking — the core design decision in any RAG implementation. You don't need to implement this. You do need to understand it well enough to ask: is our chunking strategy right for this content type?

- **Plan the conversation analytics layer before you ship the chatbot.** The analytics layer is often the higher strategic value, and it's cheaper to design it from day one than to retrofit it later.`,
  },
  {
    notionPageId: "327d23fa124b8124b83ddcf302358760__mistakes_and_course_corrections",
    title: "Mistakes and Course Corrections",
    categoryName: "Internal Process",
    body: `*What went wrong, what we'd do differently, and why it matters.*

Kevin McKeever was the first person to say the quiet part out loud. After Anna shared her strategic analysis of competitive threats, Kevin said: "I think the urgency makes a lot of sense. I think the knee jerk reaction to the sudden sense of urgency is the part I don't necessarily like." Both things are true at the same time. The project matters. The execution support is thin. Name that openly.

- **The use case got killed with zero notice.** Dan killed the forms project on Friday March 13. By Monday, they'd pivoted to 5 new options. Lesson: executive sponsors can change direction overnight. Don't over-invest in a single path until you've survived at least one leadership review with it intact.

- **First client feedback hit the thing you deprioritized.** Staff Placement launched to 30 clients. Within 3 hours, the #1 request was group collapsing — a feature the team had discussed but pushed down the list. Pressure-test your "not now" list against "what will users try to do in the first 5 minutes."

- **HIPAA compliance wasn't started before building began.** Spencer built the form validator using health history forms — medical data requiring HIPAA agreements with OpenAI. Start the compliance paperwork on day one even if you don't know your exact use case yet.

- **Sharing your preference before asking for feedback anchors the room.** Present options before opinions, every time. That certainty is exactly when your stakeholder's unanchored reaction is most valuable.

- **Adding a new project on top of existing work isn't a creative solution — it's a burnout setup.** The fix wasn't better time management — it was a clear leadership decision that specific work would be dropped, not redistributed.

- **Guardrails need to gate responses, not just instruct the model.** Guardrail rules baked into the main prompt get hallucinated past. The fix is running guardrails as a separate pre-processing classification step.

- **Don't invest in branding when the parent product can't support the pattern.** Hold all branding work until the parent product can adopt the behavior product-wide, not just in one prototype.`,
  },
];

const CHAT_HUB_ENTRIES = [
  {
    notionPageId: "327d23fa124b8184b359f1bde61de10b",
    title: "3/16 — Day 1: Kickoff & First Prototype",
    notionLastEdited: "2026-03-18T15:04:10.000Z",
  },
  {
    notionPageId: "327d23fa124b81d28e11c5fbeed624dd",
    title: "3/17 — Day 2: API Access, Twilio Blocker, Use Case Narrowing",
    notionLastEdited: "2026-03-18T14:56:52.000Z",
  },
  {
    notionPageId: "327d23fa124b813687c2ff7fb771bb42",
    title: "3/18 — Day 3: Narrowing Options, OpenAI BAA, and Miro Board Prep",
    notionLastEdited: "2026-03-18T21:06:35.000Z",
  },
  {
    notionPageId: "327d23fa124b81b998e2f28ad3e8dc1b",
    title: "3/18 — Day 3: Form Validator Live, BAA Kicked Off, Architecture Decisions",
    notionLastEdited: "2026-03-18T18:32:29.000Z",
  },
  {
    notionPageId: "328d23fa124b803b8122fb0076d8eb2c",
    title: "3/18 — Day 4",
    notionLastEdited: "2026-03-19T16:15:55.000Z",
  },
  {
    notionPageId: "328d23fa124b81ecadb3cedbbdbaa0ac",
    title: "3/19 — Day 4: First Build Day, Vercel Deployed, Demo Scheduled",
    notionLastEdited: "2026-03-19T21:07:13.000Z",
  },
];

const PROTOTYPE_HUB_ENTRIES = [
  {
    notionPageId: "327d23fa124b8167aebedab4eb61b09f",
    title: "AI Form Validator",
    categoryName: "Prototype",
    notionLastEdited: "2026-03-18T15:01:44.000Z",
  },
  {
    notionPageId: "327d23fa124b8174a9e2edbcf7e778aa",
    title: "Parent Handbook AI",
    categoryName: "Strategy",
    notionLastEdited: "2026-03-18T18:18:23.000Z",
  },
  {
    notionPageId: "327d23fa124b807fa134ea0322365392",
    title: "Campminder API Builder CC Plugin",
    categoryName: "Prototype",
    notionLastEdited: "2026-03-18T18:41:11.000Z",
  },
  {
    notionPageId: "328d23fa124b817bab04e0cd195a70cc",
    title: "Week of March 16 — Weekly Playbook Update",
    categoryName: "Planning",
    notionLastEdited: "2026-03-19T20:11:23.000Z",
  },
  {
    notionPageId: "329d23fa124b815fb840c81506f38ba0",
    title: "CampMinder Person Context — Personalized Chat via Hybrid Sync + Pre-Chat Gate",
    categoryName: "Strategy",
    notionLastEdited: "2026-03-20T13:45:05.000Z",
  },
  {
    notionPageId: "329d23fa124b8103986ffcb6dfd64c06",
    title: "CampMinder Context API — Sync-First Resilience Pattern",
    categoryName: "Strategy",
    notionLastEdited: "2026-03-20T14:08:31.000Z",
  },
];

const TRANSCRIPT_HUB_ENTRIES = [
  {
    notionPageId: "325d23fa124b808099edd545b8b4544c",
    title: "Transcript: 3/16",
    notionLastEdited: "2026-03-16T18:59:33.000Z",
  },
  {
    notionPageId: "325d23fa124b8067a11bf1749c2b89bb",
    title: "Transcript: 3/17",
    notionLastEdited: "2026-03-16T18:35:03.000Z",
  },
  {
    notionPageId: "327d23fa124b8078a6b6ef4e80ad67b0",
    title: "Epic AI Standup 3/18",
    notionLastEdited: "2026-03-18T20:45:29.000Z",
  },
];

// ── Main ────────────────────────────────────────────────────────

async function sync() {
  let added = 0;
  let updated = 0;

  // 1. AI PM Playbook sections
  console.log("Syncing AI PM Playbook (5 sections)...");
  for (const section of PLAYBOOK_SECTIONS) {
    const result = await upsertPage({
      ...section,
      type: "playbook",
      author: "Anna",
      notionLastEdited: "2026-03-19T23:07:30.000Z",
    });
    if (result === "created") added++;
    if (result === "updated") updated++;
    console.log(`  ${result}: ${section.title}`);
  }

  // 2. Chat Hub → daily learnings (body is just title for now — content fetched via MCP separately)
  console.log("Syncing Chat Hub (daily learnings)...");
  for (const entry of CHAT_HUB_ENTRIES) {
    const result = await upsertPage({
      notionPageId: entry.notionPageId,
      title: entry.title,
      body: `*Daily log from the AI Build-to-Learn experiment.*\n\nFull content synced from Notion Chat Hub. See the original at https://www.notion.so/${entry.notionPageId.replace(/-/g, "")}`,
      type: "learning",
      author: "Spencer",
      categoryName: null,
      notionLastEdited: entry.notionLastEdited,
    });
    if (result === "created") added++;
    if (result === "updated") updated++;
    console.log(`  ${result}: ${entry.title}`);
  }

  // 3. Prototype Hub → playbooks
  console.log("Syncing Prototype Hub (playbooks)...");
  for (const entry of PROTOTYPE_HUB_ENTRIES) {
    const result = await upsertPage({
      notionPageId: entry.notionPageId,
      title: entry.title,
      body: `*Prototype documentation from the AI Build-to-Learn experiment.*\n\nFull content synced from Notion Prototype Hub. See the original at https://www.notion.so/${entry.notionPageId.replace(/-/g, "")}`,
      type: "playbook",
      author: "Spencer",
      categoryName: entry.categoryName,
      notionLastEdited: entry.notionLastEdited,
    });
    if (result === "created") added++;
    if (result === "updated") updated++;
    console.log(`  ${result}: ${entry.title}`);
  }

  // 4. Transcript Hub → learnings
  console.log("Syncing Transcript Hub (learnings)...");
  for (const entry of TRANSCRIPT_HUB_ENTRIES) {
    const result = await upsertPage({
      notionPageId: entry.notionPageId,
      title: entry.title,
      body: `*Meeting transcript from the AI Build-to-Learn experiment.*\n\nFull content synced from Notion Transcript Hub. See the original at https://www.notion.so/${entry.notionPageId.replace(/-/g, "")}`,
      type: "learning",
      author: "Anna",
      categoryName: null,
      notionLastEdited: entry.notionLastEdited,
    });
    if (result === "created") added++;
    if (result === "updated") updated++;
    console.log(`  ${result}: ${entry.title}`);
  }

  // Write sync log
  const details = JSON.stringify([
    ...PLAYBOOK_SECTIONS.map(s => ({ title: s.title, action: "created" })),
    ...CHAT_HUB_ENTRIES.map(e => ({ title: e.title, action: "created" })),
    ...PROTOTYPE_HUB_ENTRIES.map(e => ({ title: e.title, action: "created" })),
    ...TRANSCRIPT_HUB_ENTRIES.map(e => ({ title: e.title, action: "created" })),
  ]);

  await sql`
    INSERT INTO lh_sync_log (pages_added, pages_updated, details)
    VALUES (${added}, ${updated}, ${details}::jsonb)
  `;

  console.log(`\nDone! ${added} added, ${updated} updated.`);
  await sql.end();
}

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
