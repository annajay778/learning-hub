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
   - This is non-negotiable. Other editors hide \`.env\` files, which means you can't see or edit API keys and credentials. VS Code shows everything.

2. **Download and install [Git](https://git-scm.com/downloads)**

3. **Create a [GitHub](https://github.com) account** if you don't have one
   - Ask your engineer to add you to the team's GitHub organization

4. **Install [Node.js](https://nodejs.org/)** (LTS version)
   - This runs the development server and build tools

5. **Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code)** (the CLI)
   - Also install the **Claude Chrome extension** — but note: you can only use one at a time. The desktop app and Chrome extension fight for the same connection.
   - **Workaround:** Fully quit Claude Desktop when doing design iteration with Claude Chrome.

## Step 2: Clone Your First Project

Ask your engineer for the repo URL, then open your terminal and run:

\`\`\`bash
git clone <repo-url>
cd <project-name>
npm install
\`\`\`

Then start the dev server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the app running.

## Step 3: Set Up Environment Variables

1. In VS Code, open the project folder
2. Look for a file called \`.env.example\` — copy it to \`.env.local\`
3. Ask your engineer for the actual values (API keys, database URLs, auth tokens)
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

**Try it now:** Open any file in VS Code, make a small text change, then run:

\`\`\`bash
git add .
git commit -m "my first commit"
git push
\`\`\`

## Step 5: Set Up Context Seven (MCP Server)

Here's the irony: Claude's training data doesn't include recent AI patterns. It defaults to old models and deprecated APIs.

1. Install the Context Seven MCP server in Claude Code
2. This gives Claude access to current, up-to-date documentation for the frameworks you're using

> *Spencer — can you add the exact install commands here?*

## Step 6: Learn the Starter Pack Workflow

Spencer's starter pack includes slash commands for a full development loop:

1. **\`/brainstorm\`** — Explore the problem space
2. **\`/plan\`** — Create a structured implementation plan
3. **\`/work\`** — Build it (test-driven)
4. **\`/review\`** — Code review
5. **\`/compound\`** — Document what you learned ← *most people skip this, but it's critical*

**Why compound matters:** It updates Claude's persistent understanding of your project. Every future brainstorm and plan gets more accurate because Claude remembers what you've already tried and learned.

> **Try it now:** Open Claude Code in your project directory and type \`/brainstorm\`. See what happens.

---

## Quick Reference

| Tool | What it's for | Link |
|------|--------------|------|
| VS Code | Edit code + see .env files | [code.visualstudio.com](https://code.visualstudio.com/) |
| Git + GitHub | Version control + collaboration | [github.com](https://github.com) |
| Node.js | Run the dev server | [nodejs.org](https://nodejs.org/) |
| Claude Code | AI-assisted development (CLI) | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| Claude Chrome | AI-assisted design iteration (browser) | Chrome Web Store |
| Vercel | Hosting + auto-deploy from GitHub | [vercel.com](https://vercel.com/) |
| Neon | PostgreSQL database | [neon.tech](https://neon.tech/) |`;

const WORKING_WITH_AI_ENGINEER = `*How the PM/engineer dynamic changes when your partner builds at 10x speed.*

## The New Mental Model

Forget "PM specs, engineer builds." The new model is **engineer prototypes, PM steers.**

When your engineer can have a working prototype before you've finished analyzing the problem space, the prototype becomes your discovery artifact. Showing a working thing generates more useful feedback in 15 minutes than a spec document ever would.

---

## Step 1: Divide by Superpowers

Don't divide work by component ("you do backend, I do frontend"). Divide by what each person is best at:

| PM Handles | Engineer Handles |
|-----------|-----------------|
| Design iteration (using Claude Chrome to match existing styling) | AI logic and model selection |
| Stakeholder communication and demos | API integrations and infrastructure |
| Scope decisions and prioritization | Deployment and DevOps |
| Content, copy, and UX writing | Automated documentation tooling |

The key: **neither person waits for the other.** The PM who learns basic Git (Step 4 in Module 1) can push design changes directly. No handoff needed.

## Step 2: Set Up Automated Documentation

Don't rely on manual status updates. Build documentation into the engineer's workflow:

1. **"Update Playbook" slash command** — Auto-captures what happened after each Claude Code session
2. **Meeting recordings** — Every meeting auto-recorded and transcribed to a shared Notion table
3. **Learning Hub entries** — Daily learnings captured at the source, searchable later

> **The goal:** The PM never has to ask "what did you work on yesterday?" The data is already there.

## Step 3: Find Your Communication Cadence

Traditional standups will break at AI-prototype speed. Expect to iterate.

**What we learned works:**
- **Async daily posts** — Both people post what they did yesterday (to Slack or a shared doc)
- **Pairing sessions as needed** — Not scheduled, just "hey can you look at this"
- **One longer alignment meeting** — Replace the 15-min standup with 30 min of actual discussion

**Pro tip:** Run Claude in parallel during meetings. While someone demos, have Claude researching or drafting in the background. By meeting's end, you'll have a head start on whatever was discussed.

## Step 4: Understand Where AI Belongs in a Feature

This is the most common point of confusion for stakeholders. Here's the mental model:

| AI does | Code does |
|---------|----------|
| Draft text and personalize messages | Schedule when things happen |
| Synthesize data and generate insights | Enforce business rules |
| Classify and categorize content | Handle timing and triggers |
| Match tone and style | Send emails/SMS/notifications |

**When someone says "AI feature," they usually mean:** a code feature with one AI-powered component inside it.

## Step 5: Split Build Tracks When You're Ready

When two viable ideas exist, each person can own one track independently:

1. Agree on the two directions
2. **Budget a setup session** — the PM needs to be provisioned (starter pack, Vercel environment, database, auth)
3. Each person builds and learns independently
4. Reconvene to compare and decide

**Result:** Double the learning in the same amount of time.`;

const MOVING_FAST = `*What to skip, what not to skip, and how to stay aligned when everything ships in hours instead of sprints.*

## The Core Change

We killed the Kanban board on day one. Updating stories and keeping a board current was consuming half the PM's week. The new approach: **capture everything, shape it later.**

---

## Step 1: Set the Expectations

Say this loudly and often to everyone who sees the work: **"Build for speed, not scale. Every prototype is disposable."**

Stakeholders will see a working prototype and want to ship it to everyone. Get ahead of this. Frame it early:

> "We're building to learn, not to ship. The goal is to prove what works, then rebuild it properly."

## Step 2: Don't Build on Day One

The temptation is to start coding immediately. Resist it.

**Day one checklist:**
- [ ] Align on what problem you're solving and for whom
- [ ] Identify the biggest risks (what could kill this?)
- [ ] Agree on what "done" means for the first sprint
- [ ] Set up your communication rituals (see Step 4)
- [ ] Ensure nothing from your existing work falls through the cracks

Building starts on day two.

## Step 3: Get a Coach or Thinking Partner

When the project is ambiguous and high-stakes, you need a forcing function for reflection. A coach (internal or external) gives you structured time to think when the pace makes it feel impossible.

**What to bring to coaching:**
- What you're stuck on
- Decisions you're avoiding
- What feels wrong but you can't articulate

## Step 4: Build Your Communication Rituals

Your standup format from traditional sprints will break within 48 hours. Plan to iterate on it.

**A starting point:**
1. **Automated daily Slack posts** — Each person writes 3 bullets: what I did, what I'm doing, what's blocking me
2. **One 30-min alignment meeting** — Replace the 15-min standup. You'll have too much to share.
3. **Pairing sessions as needed** — Don't schedule these, just do them when something needs two brains

> *Spencer — can you document the exact Slack automation setup you built? Step-by-step so someone could recreate it.*

## Step 5: Always Have a Backup Direction

Your first use case might get killed before you start. Leadership can change direction overnight.

**How to protect yourself:**
- Keep a "wider option set" — 3-5 viable directions at all times
- Don't over-invest in one path until it's survived at least one leadership review
- When a pivot happens, you can move in hours, not weeks

---

## How to Capture Work Without a Kanban Board

| What you need to track | Where it goes | Why this works |
|----------------------|--------------|---------------|
| Daily learnings | Learning Hub | Searchable, timestamped, visible to leadership |
| Meeting decisions | Notion (auto-recorded) | No manual transcription |
| Session progress | \`/compound\` in Claude Code | Captured at the source, improves future AI sessions |
| Key decisions | Playbook pages | Durable reference anyone can find later |

The trick: data capture is baked into the tools you're already using. You don't maintain a separate board — you just shape the captured data into whatever form someone needs (standups, stakeholder updates, playbooks) after the fact.`;

const DISCOVERY_WITH_AI = `*How to use AI to compress weeks of research into hours.*

## The Big Unlock

You can feed Claude 50+ sources in a single session — conference data, competitor release notes, customer feedback, internal analytics — and get scored, structured analysis back the same day. This would take weeks of manual synthesis. It takes hours.

**The speed of synthesis IS the capability to demonstrate.** When you show stakeholders how fast you got there, that's often more impressive than what you found.

---

## Step 1: Build Your Source Library

Before you ask Claude anything, gather your raw inputs. The more diverse the sources, the better the synthesis.

**Types of sources to collect:**
- Competitor feature announcements and release notes
- Customer feedback (conference notes, support tickets, sales call transcripts)
- Internal analytics and usage data
- Industry articles and analyst reports
- Meeting transcripts where stakeholders described the problem

**How to organize:** Drop everything into a [Claude Project](https://claude.ai). Each project can hold many files as persistent context.

## Step 2: Run Your First Synthesis

Once your sources are in a Claude Project, use this prompt as a starting point:

> *"Synthesize all the sources I've uploaded. Identify the top 5 opportunities, scored by: (1) customer impact, (2) feasibility with current tech, and (3) competitive differentiation. For each opportunity, include a brief competitive analysis."*

**What to look for:**
- Themes that appear across multiple source types (strongest signal)
- Themes you expected that DIDN'T appear (absence is data — it tells you what your sources actually contain)
- Surprising connections between sources

## Step 3: Use Prototypes as Discovery Artifacts

**Stop writing specs. Build something and show it.**

A working prototype — even one built in a single day — generates more useful feedback than any document. When you demo something real:
- Stakeholders react to what it IS, not what they imagine it could be
- You discover adjacent opportunities ("this is more than X — it's Y")
- You get feedback on actual UX, not theoretical flows

**The workflow:**
1. Run your synthesis (Step 2)
2. Pick the most promising option
3. Have your engineer prototype it (even a rough version)
4. Demo it to stakeholders
5. Use feedback to refine or pivot

## Step 4: Learn Enough About RAG to Make Product Decisions

If your prototype involves AI answering questions from a knowledge base, you'll encounter RAG (Retrieval-Augmented Generation). You don't need to implement it. You need to understand one key concept: **chunking.**

Chunking is how documents get split into pieces for the AI to search. The wrong chunking strategy means the AI finds the wrong pieces and gives bad answers.

**The PM question to ask your engineer:** "Is our chunking strategy right for this content type? Are we splitting things in a way that preserves meaning?"

> *Spencer — can you add a concrete example here? Like what bad chunking looks like vs good chunking, maybe using a camp handbook page as an example?*

## Step 5: Design the Analytics Layer Before You Ship

If you're building any kind of chatbot or AI assistant, the analytics layer is often more strategically valuable than the chatbot itself. Design it from day one.

**What to plan to capture:**
- What questions are people asking? (topic clustering)
- What topics have no good answer? (content gaps)
- Which responses get follow-up questions? (signal of a bad answer)
- Usage patterns over time (when, how often, by whom)

Retrofitting analytics after launch is expensive. Planning it upfront is nearly free.`;

const MISTAKES = `*What went wrong, what we'd do differently, and why it matters for anyone doing this work.*

---

## Mistake 1: Your First Idea Will Probably Get Killed

**What happened:** Our original use case was killed by the executive sponsor on a Friday. By Monday, we'd pivoted to 5 new options.

**Lesson for you:**
- Don't over-invest emotionally or technically in your first direction
- Always keep a wider option set (3-5 viable paths)
- Treat the first use case as expendable until it survives at least one leadership review

## Mistake 2: Users Will Immediately Try the Thing You Deprioritized

**What happened:** A prototype launched to 30 users. Within 3 hours, the #1 request was a feature the team had discussed but pushed down the list.

**Lesson for you:**
- Before you deprioritize anything, ask: *"What will users try to do in the first 5 minutes?"*
- Pressure-test your "not now" list against first-use behavior
- If something feels like a "nice to have" but would be the first thing you'd try as a user, reconsider

## Mistake 3: Start Compliance and Approvals on Day One

**What happened:** We built a working prototype before realizing the data it used required compliance agreements with our AI vendor. This created a blocker after the thing was already working.

**Lesson for you:**
- On day one, ask: *"Does any data we might touch require special handling?"*
- Start paperwork immediately, even if your exact use case isn't locked in
- External approval processes (vendor agreements, security reviews, legal) take longer than you think and can't be parallelized with building

## Mistake 4: Don't Share Your Opinion Before Asking for Feedback

**What happened:** In stakeholder demos, sharing our preferred option before asking for reactions anchored the room. People agreed with us instead of reacting honestly.

**Lesson for you:**
- Present options before opinions, every time
- The moment you feel most certain is exactly when unanchored stakeholder reactions are most valuable
- Try: "Here are three directions. What's your gut reaction?" — then wait

## Mistake 5: New Project on Top of Existing Work = Burnout

**What happened:** The AI prototyping project was added on top of existing responsibilities. Nobody's existing work was dropped or reassigned.

**Lesson for you:**
- The fix is never "better time management"
- It's a clear leadership decision about what specific work gets dropped
- If the answer is "nothing gets dropped," escalate that tension explicitly. Don't absorb it silently.

## Mistake 6: Prompt-Based Guardrails Get Hallucinated Past

**What happened:** We told the AI "never give medical advice" in the system prompt. It occasionally gave medical advice anyway.

**Lesson for you:**
- Guardrail rules inside the main prompt are suggestions, not gates
- The fix: run guardrails as a **separate classification step** that checks the AI's response before the user sees it
- If the classifier flags the response, block it and return a safe fallback — don't just hope the prompt instruction holds

## Mistake 7: Don't Invest in Branding Too Early

**What happened:** We spent time on branding, naming, and visual identity for AI features before the product could actually support those patterns at scale.

**Lesson for you:**
- Hold branding work until the parent product can adopt the pattern product-wide
- A branded feature in an unbranded context creates confusion
- Focus on proving the value first. Names and logos are the easy part.`;

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

  await sql.end();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
