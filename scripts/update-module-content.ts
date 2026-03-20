import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

const GETTING_SET_UP = `*Your 2-hour path from zero to pushing code. Anna did this in one pairing session with Spencer.*

## Before You Start

You don't need to become an engineer. But you need to learn enough to not be a bottleneck. The learning curve is steep for about 2 hours, then it flattens.

---

## Step 1: Install Your Tools

1. **Download and install [VS Code](https://code.visualstudio.com/)**
   - This is non-negotiable for the whole product team. Other editors hide \`.env\` files, which blocks you from a whole class of setup tasks.

2. **Download and install [Git](https://git-scm.com/downloads)**

3. **Create a [GitHub](https://github.com) account** if you don't have one
   - Ask Spencer to add you to the team's GitHub organization

4. **Install [Node.js](https://nodejs.org/)** (LTS version)
   - This runs the development server and build tools

5. **Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (the CLI)
   - Also install the **Claude Chrome extension** — but note: you can only use one at a time. The desktop app and Chrome extension fight for the same connection.
   - **Workaround:** Fully quit Claude Desktop when doing design iteration with Claude Chrome.

## Step 2: Clone the Starter Pack

Ask Spencer to give you the repo URL, then open your terminal and run:

\`\`\`bash
git clone <repo-url>
cd <project-name>
npm install
\`\`\`

## Step 3: Set Up Environment Variables

1. In VS Code, open the project folder
2. Look for a file called \`.env.example\` — copy it to \`.env.local\`
3. Ask Spencer for the actual values (API keys, database URLs, auth tokens)
4. **Never commit \`.env.local\` to GitHub.** It's in \`.gitignore\` for a reason.

> **Naming convention:** Prefix all cloud resources with your initials from day one (e.g., "AJ-Smart-Nudge"). Simple habit, real organizational payoff.

## Step 4: Learn Git in 5 Minutes

You only need 4 concepts:

| Concept | What it does | Command |
|---------|-------------|---------|
| **Commit** | Saves your work locally | \`git add . && git commit -m "description"\` |
| **Push** | Sends to GitHub (triggers redeploy on Vercel) | \`git push\` |
| **Branch** | Work without affecting the live prototype | \`git checkout -b my-branch\` |
| **PR** | Ask your engineer to review before merging | Create on GitHub |

That's it. You can learn the rest as you go.

## Step 5: Set Up Context Seven (MCP Server)

Here's the irony: Claude's training data doesn't include recent AI patterns. It defaults to old models and deprecated APIs.

1. Install the Context Seven MCP server in Claude Code
2. This gives Claude access to current documentation for the tools you're using

> *We're still a little hazy on the exact install steps here — Spencer, can you add the specific commands?*

## Step 6: Learn the Starter Pack Workflow

Spencer's starter pack includes slash commands for a full development loop:

1. **\`/brainstorm\`** — Explore the problem space
2. **\`/plan\`** — Create a structured implementation plan
3. **\`/work\`** — Build it (test-driven)
4. **\`/review\`** — Code review
5. **\`/compound\`** — Document what you learned ← *most people skip this, but it's critical*

Compound updates Claude's persistent understanding of your project, so every future brainstorm and plan is more accurate.

---

## Things to Know

- **Scheduled tasks: use CoWork, not Claude Code cron.** Claude Code cron jobs expire after 3 days (security feature). Use CoWork scheduled tasks for daily automations.

- **Agentic browsers have real security risks.** Hidden prompt injections on web pages can override Claude's instructions. Always keep your terminal visible to monitor what Claude Chrome is doing.

- **WiFi kills AI features at camp.** Any feature requiring real-time API calls is useless without strong facility WiFi. Always ask "what happens if there's no internet?"

- **External approvals are invisible blockers.** Twilio campaign approval stalled the form validator for days. Start approval processes the same day you decide on a feature direction.

- **AI doesn't understand time.** Code handles *when* (cron jobs, rules engine), AI handles *what* (drafting, personalization). Don't ask AI to schedule things.`;

const WORKING_WITH_AI_ENGINEER = `*How the PM/engineer dynamic changes when your partner builds at 10x speed.*

## The New Mental Model

Forget "PM specs, engineer builds." The new model is **engineer prototypes, PM steers.**

On day one, Spencer had a working form validator — 99% accuracy, handwritten form processing, SMS notifications — before Anna had finished analyzing which use case to pursue. That prototype became the discovery artifact. It generated more useful feedback in 15 minutes of standup than a one-pager ever would.

---

## Step 1: Divide by Superpowers

Don't divide work by component. Divide by what each person is best at:

| PM Handles | Engineer Handles |
|-----------|-----------------|
| Branding and design iteration | AI logic and model selection |
| Stakeholder communication | API integrations |
| Scope decisions | Infrastructure and deployment |
| Using Claude Chrome to match existing app styling | Building the "Update Playbook" automation |

Neither person waits for the other. The unlock: **a PM who learns basic Git can directly contribute to the codebase.** Anna learned this in one pairing session and was pushing design changes the same day.

## Step 2: Set Up Shared Documentation

Your engineer should be your documentarian too. Here's the system Spencer built:

1. **"Update Playbook" command** — auto-captures session progress after each Claude Code session
2. **Notion meeting table** — every meeting recorded and structured automatically
3. **Automated daily Slack posts** — both people post yesterday's work, Claude generates a daily plan

> **Why this matters:** The PM doesn't have to chase the engineer for status. Data capture is baked into the workflow.

## Step 3: Set Your Communication Cadence

The 15-minute standup broke by day 2. Both people had too much to share.

**What works:**
- Automated daily Slack posts (async status)
- Pairing sessions as needed throughout the day
- A merged standup/alignment meeting (longer than 15 min)

**Pro tip:** Run Claude in parallel during meetings. Anna called this a "10/10" technique — while Spencer demoed the parent handbook, Anna had Claude scrubbing Salesforce docs. By meeting's end, she had a full execution plan.

## Step 4: Know Where AI Actually Belongs

Your engineer will tell you, but here's the mental model:

- **AI does:** Drafting text, personalizing messages, synthesizing data, generating insights
- **Code does:** Scheduling, timing, business rules, sending messages
- **"AI feature" often means:** Code feature with one AI component

Example: "Smart nudges" sounds like AI decides when to send. Actually, code handles cadence. AI handles drafting the message in the camp's tone.

## Step 5: Split Build Tracks (When Ready)

When two viable concepts exist, each person owns one track independently. Results:
- Double the learning surface
- Deep firsthand knowledge of two problem spaces instead of one
- But: budget a deliberate setup session (starter pack, Vercel, Neon DB, blob storage, auth)

> Coach Stephanie Tanzar recommended this approach when Anna and Spencer had both nudges and AI handbook as viable concepts.`;

const MOVING_FAST = `*What to skip, what not to skip, and how to stay aligned when everything ships in hours instead of sprints.*

## The Core Change

We killed the Kanban board on day one. Anna's reasoning: in traditional sprints, updating stories consumed half her week. The new approach: **capture data comprehensively, shape it later.**

---

## Step 1: Set the Mantra

Say this loudly and often: **"Build for speed, not scale."**

Every prototype is disposable. Say so before anyone gets attached. Kevin McKeever warned that stakeholders will see a working prototype and want to ship it to everyone. His framing:

> "We can use this pig for this summer. We should try to not use this pig for next summer."

## Step 2: Don't Build on Day One

The temptation is to start coding immediately. Don't.

**Day one checklist:**
- [ ] ROAM risk assessment
- [ ] Interim governance model
- [ ] Ensure nothing falls through the cracks
- [ ] Align on what "done" means for the first sprint

Building starts on day two.

## Step 3: Get a Coach

This isn't optional for ambiguous, high-stakes projects. Anna started coaching sessions with Stephanie Tanzar the same week the original use case got killed.

A coach is a forcing function for reflection when you're moving too fast to think.

## Step 4: Rebuild Your Communication Rituals

Your standup format from traditional sprints will break at this pace. Expect to iterate on it.

**Week 1 evolution:**
1. Started with 15-min standups — too short by day 2
2. Moved to automated daily Slack posts + merged standup/alignment meeting
3. Added pairing sessions as needed

> *Spencer, what's the current standup format and Slack automation? Can you document the exact setup?*

## Step 5: Always Have a Backup Use Case

Your first use case might get killed before you start. Dan killed the forms project on Friday. By Monday, the team had pivoted to a broader AI Lab with 5 new options.

**Lesson:** Don't over-invest in a single path until you've survived at least one leadership review with it intact.

---

## How We Capture Work (Instead of a Kanban Board)

| What | How | Why |
|------|-----|-----|
| Daily learnings | Learning Hub entries | Searchable, timestamped |
| Meeting notes | Auto-recorded to Notion | No manual transcription |
| Session progress | Spencer's "Update Playbook" command | Captured at the source |
| Decisions | Playbook pages | Durable reference |

The data is always there. We just shape it into whatever form is needed — standups, stakeholder updates, playbooks — after the fact.`;

const DISCOVERY_WITH_AI = `*How AI changes the discovery loop — from research synthesis to prototype testing.*

## The Big Unlock

Anna fed Claude 55 sources in a single day — conference data, competitor release notes, camp director feedback, domain scoring analysis, industry articles. Claude produced 5 scored AI use case options with competitive analysis. This would have taken weeks. It took hours.

> Stephanie Tanzar said the most significant thing Anna had done wasn't the 5 options — it was synthesizing 55 sources in a single afternoon. **The speed of synthesis IS the capability to demonstrate.**

---

## Step 1: Build Your Source Library

Before you start asking Claude anything, gather your inputs:

1. **Competitor data** — Release notes, feature announcements, pricing pages (Campfront, CampBrain, UltraCamp, CampDoc, etc.)
2. **Customer feedback** — Conference notes, support tickets, sales call transcripts
3. **Internal data** — Domain scoring, usage analytics, product roadmap
4. **Industry context** — Articles, analyst reports, market trends

> **Prompt to use:** Drop all sources into a Claude Project and ask:
> *"Synthesize these sources. Identify the top 5 AI use cases for our product, scored by customer impact, feasibility, and competitive differentiation. Include a competitive analysis for each."*

## Step 2: Show Prototypes, Not Specs

**Prototypes ARE discovery artifacts.** Spencer's marketing drip campaign tool — built in 9 hours with real API data — expanded the option set beyond what research alone produced.

When Scott saw the demo, he said: *"This is far more than a drip campaign — this is a marketing team in a box."*

**The rule:** Show, don't spec. A working prototype generates more useful feedback in 15 minutes than a one-pager ever would.

## Step 3: Design for the Bimodal Reaction

Camp directors split into two clear groups on AI:
- **Early adopters:** "I want it tomorrow"
- **Conservatives:** "I'd rather answer a thousand emails by hand than get one wrong"

**What to do:**
- Run fast with the early adopters
- Design human-in-the-loop for the conservatives
- Never force AI on the second group

## Step 4: Know Enough About RAG

You don't need to implement RAG. You do need to understand **chunking** — the core design decision in any RAG implementation.

**The PM question to ask:** "Is our chunking strategy right for this content type?"

> *Spencer, can you add a simple explainer of chunking here? Like: what it is, why it matters, and what a bad chunking decision looks like in practice?*

## Step 5: Plan Analytics Before You Ship

The analytics layer on top of a chatbot is often higher strategic value than the chatbot itself. Design it from day one — retrofitting is expensive.

**What to capture:**
- What are parents/staff asking about?
- What topics have no good answer?
- What time of day/season do questions spike?
- Which responses get follow-up questions (indicating a bad answer)?

---

## Things to Remember

- **Physical discovery still matters.** The "camp in your pocket" idea came from Anna physically visiting camps and seeing 3 staff in an office out of 3,000 on-site. AI accelerates synthesis but can't replace walking the floor.

- **Absence is data.** When Claude doesn't surface an expected theme in synthesis, that tells you something about what your data actually contains.`;

const MISTAKES = `*What went wrong, what we'd do differently, and why it matters.*

Kevin McKeever was the first to say the quiet part out loud: *"I think the urgency makes a lot of sense. The knee-jerk reaction to the sudden sense of urgency is the part I don't necessarily like."* Both things are true. The project matters. The execution support is thin. Name that openly.

---

## Mistake 1: The Use Case Got Killed Overnight

**What happened:** Dan killed the forms project on Friday March 13. By Monday, the team had pivoted to 5 new options.

**What to do differently:**
- Don't over-invest in a single path until you've survived at least one leadership review
- Always have a wider option set ready
- Treat the first use case as expendable

## Mistake 2: First Client Feedback Hit What We Deprioritized

**What happened:** Staff Placement launched to 30 clients. Within 3 hours, the #1 request was group collapsing — a feature the team had discussed but pushed down the list.

**What to do differently:**
- Before deprioritizing anything, ask: *"What will users try to do in the first 5 minutes?"*
- Pressure-test your "not now" list against first-use behavior

## Mistake 3: HIPAA Compliance Wasn't Started Before Building

**What happened:** Spencer built the form validator using health history forms — medical data requiring HIPAA agreements with OpenAI. This created a blocker after the prototype was already working.

**What to do differently:**
- Start compliance paperwork on day one, even if you don't know the exact use case
- Ask early: *"Does any data we might touch require special handling?"*

## Mistake 4: Anchoring Stakeholder Feedback

**What happened:** Sharing your preference before asking for feedback anchors the room. People agree with you instead of reacting honestly.

**What to do differently:**
- Present options before opinions, every time
- Your certainty is exactly when unanchored reactions are most valuable

## Mistake 5: Adding Work Without Removing Work

**What happened:** The AI project was added on top of existing responsibilities without anything being dropped.

**What to do differently:**
- The fix isn't better time management — it's a clear leadership decision about what gets dropped
- Work that's "redistributed" is work that doesn't get done. Name what's actually stopping.

## Mistake 6: Guardrails That Don't Actually Guard

**What happened:** Guardrail rules baked into the main prompt got hallucinated past. The AI would occasionally give medical advice despite being told not to.

**What to do differently:**
- Run guardrails as a **separate pre-processing classification step**, not as instructions in the main prompt
- Gate responses, don't just instruct the model

## Mistake 7: Premature Branding

**What happened:** Time was spent on branding and naming for the AI features before the parent product could support the pattern.

**What to do differently:**
- Hold all branding work until the parent product can adopt the behavior product-wide
- A branded feature in an unbranded context creates confusion, not excitement`;

async function main() {
  await sql`UPDATE lh_pages SET body = ${GETTING_SET_UP}, updated_at = NOW() WHERE id = '5d5ca08d-5ec0-476e-8a9b-b809cb6d30fa'`;
  console.log("Updated: Getting Set Up");

  await sql`UPDATE lh_pages SET body = ${WORKING_WITH_AI_ENGINEER}, updated_at = NOW() WHERE id = '0bd6f2d9-f8ee-4e17-a9c1-f059c06ed011'`;
  console.log("Updated: Working with AI Engineer");

  await sql`UPDATE lh_pages SET body = ${MOVING_FAST}, updated_at = NOW() WHERE id = 'b0272b3f-32fa-4fc6-a862-6294ed694b11'`;
  console.log("Updated: Moving Fast");

  await sql`UPDATE lh_pages SET body = ${DISCOVERY_WITH_AI}, updated_at = NOW() WHERE id = '098a197b-5758-4849-82fa-0f101df82923'`;
  console.log("Updated: Discovery with AI");

  await sql`UPDATE lh_pages SET body = ${MISTAKES}, updated_at = NOW() WHERE id = '57cf6790-98ff-49e8-95d9-70664c7d0a7e'`;
  console.log("Updated: Mistakes");

  // Assign remaining unassigned playbooks to prototypes module
  const result = await sql`UPDATE lh_pages SET module_slug = 'prototypes' WHERE module_slug IS NULL AND type = 'playbook'`;
  console.log(`Assigned ${result.count} remaining playbooks to prototypes module`);

  await sql.end();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
