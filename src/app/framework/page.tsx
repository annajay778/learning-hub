"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const STATUS_COLORS: Record<string, string> = {
  Have: "bg-emerald-100 text-emerald-800",
  "Can't measure yet": "bg-amber-100 text-amber-800",
  Anecdotal: "bg-amber-100 text-amber-800",
  Partially: "bg-blue-100 text-blue-800",
  "Not measurable": "bg-gray-200 text-gray-700",
  "Not measurable yet": "bg-gray-200 text-gray-700",
  "Not measurable from our data": "bg-gray-200 text-gray-700",
  "In progress": "bg-blue-100 text-blue-800",
  High: "bg-red-100 text-red-800",
  Medium: "bg-amber-100 text-amber-800",
  Unvalidated: "bg-amber-100 text-amber-800",
  "Likely true": "bg-emerald-100 text-emerald-800",
  "Partially validated": "bg-blue-100 text-blue-800",
  Low: "bg-emerald-100 text-emerald-800",
};

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5">
                  {j === 1 && STATUS_COLORS[cell] ? (
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${STATUS_COLORS[cell]}`}
                    >
                      {cell}
                    </Badge>
                  ) : j === 0 ? (
                    <span className="font-medium">{cell}</span>
                  ) : (
                    <span className="text-muted-foreground">{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SmartNudgesLFA() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Inputs — What we&apos;re working with
        </h2>
        <Table
          headers={["Input", "Status", "Notes"]}
          rows={[
            ["Real camp data for 6 beta camps", "Have", "Daily feed of missing forms, family names, contact info, session dates — refreshed every morning"],
            ["5 camp partners actively testing", "Have", "Engaged directors giving feedback 3x/week, staggered so each call improves the next"],
            ["A delivery channel parents respond to", "Partially", "SMS works but camps told us texting is reserved for emergencies — continuing to think on how to approach this problem"],
            ["Camp directors willing to configure", "Partially", "~2 min setup; directors are co-designing the experience with us in live sessions"],
            ["Ability to measure form completion over time", "Have", "Daily snapshots show whether forms are getting done — the baseline for proving impact"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outputs — What camps experience
        </h2>
        <Table
          headers={["Output", "Status", "Notes"]}
          rows={[
            ["Targeted reminders reach the right families", "Have", "Only contacts families with missing forms, skips those who are complete, adjusts by session proximity"],
            ["Camps see and approve everything before it goes out", "Have", "Full preview of who gets contacted, what the message says, and why anyone was skipped — nothing sends without approval"],
            ["The system explains itself", "Have", "Every skip has a reason, every batch has a summary — directors never have to wonder what happened or why"],
            ["Form completion trends are visible", "Have", "Camps can see whether the needle is moving day over day — not just a one-time snapshot"],
            ["Camps control the cadence", "Partially", "Directors can see when reminders would fire; full automation (set it and forget it) is being rebuilt this week based on client feedback"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outcomes — What changes in the medium-term
        </h2>
        <Table
          headers={["Outcome", "Status", "Gap?"]}
          rows={[
            ["Parents complete forms faster after being reminded", "Can't measure yet", "We see totals drop daily but can't yet prove nudges caused it vs. parents who would have completed anyway"],
            ["Directors spend less time chasing families manually", "Anecdotal", "Directors tell us this is what they want — no baseline to compare against yet"],
            ["Fewer incomplete families when sessions start", "Can't measure yet", "Building a \"% complete by session start\" metric to prove this"],
            ["Directors trust the tool enough to keep using it", "Partially", "Transparency (seeing what goes out, why people were skipped) is building trust — need to track whether they come back week over week"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Impact — What this means for Campminder
        </h2>
        <Table
          headers={["Impact", "Status", "Gap?"]}
          rows={[
            ["Camps open their sessions with fewer missing forms", "Not measurable yet", "We'll know after first sessions start with nudges running — need camp feedback post-opening day"],
            ["Kids are safer because health forms are complete", "Not measurable yet", "Downstream of form completion — if we prove nudges work, this follows"],
            ["Directors spend their time on programs, not paperwork", "Not measurable yet", "Qualitative — needs post-pilot interviews with directors"],
            ["Campminder proves AI can power camp operations at scale", "In progress", "This experiment IS the proof — every week adds evidence for or against the model"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Key Assumptions (and risks)
        </h2>
        <Table
          headers={["Assumption", "Risk Level", "What could break it"]}
          rows={[
            ["Parents will act on reminders from Campminder", "High", "They may ignore messages from unfamiliar senders — need to come from a trusted source"],
            ["Gentle-to-urgent escalation drives more completions", "Unvalidated", "No data yet on whether tone changes matter — building measurement into the next version"],
            ["Reminders timed to session start create natural urgency", "Likely true", "Most camps think in sessions — but some have rolling enrollment that doesn't fit this model"],
            ["Email is a better channel than text for non-urgent reminders", "Likely true", "Validated by 2 camps independently saying texting is reserved for emergencies"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Feedback Loops
        </h2>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="mb-1 text-sm font-medium">Working loop:</p>
              <p className="text-sm text-muted-foreground">
                Family gets nudge → completes form → next import shows 0
                missing → stops getting nudged.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Missing loops:</p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>
                  <strong>No attribution</strong> — We see forms drop
                  day-over-day but can&apos;t prove nudges caused it
                </li>
                <li>
                  <strong>No completion acknowledgment</strong> — Parent
                  completes forms but never hears &ldquo;thanks&rdquo;
                </li>
                <li>
                  <strong>No tone effectiveness data</strong> — We send but
                  don&apos;t measure which escalation step converted
                </li>
                <li>
                  <strong>No director engagement tracking</strong> — No
                  visibility into whether directors keep using the tool
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Outcome Tracking — Implementation Plan
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          A closed-loop system that answers: &ldquo;Did the nudges actually
          work?&rdquo;
        </p>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-2 text-sm font-semibold">
                Three capabilities:
              </h3>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>
                  <strong>Nudge-to-completion tracking</strong> — When a nudged
                  family&apos;s forms go to 0, mark that nudge chain as
                  &ldquo;resolved&rdquo; and record how long it took
                </li>
                <li>
                  <strong>Outcome dashboard</strong> — Show conversion rates,
                  time-to-complete, and which tones drove action
                </li>
                <li>
                  <strong>Director activity log</strong> — Track usage to prove
                  adoption
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Data Model
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">
              New table: nudge_outcomes
            </h3>
            <Table
              headers={["Column", "Type", "Purpose"]}
              rows={[
                ["id", "uuid", "PK"],
                ["familyId / staffMemberId", "uuid FK", "Who completed"],
                ["campId", "uuid FK", "Which camp"],
                ["nudgeCount", "integer", "How many reminders were sent before completion"],
                ["lastTone", "text", "Which tone was the last one sent (friendly/professional/urgent)"],
                ["firstNudgeAt", "timestamp", "When the first reminder was sent"],
                ["resolvedAt", "timestamp", "When forms hit 0"],
                ["daysToResolve", "integer", "Computed: resolvedAt - firstNudgeAt"],
                ["formsCompleted", "integer", "How many forms went from missing → received"],
                ["attributionType", "text", "\"nudged\" (got reminders) or \"organic\" (never nudged but completed)"],
              ]}
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">
              New table: director_events
            </h3>
            <Table
              headers={["Column", "Type", "Purpose"]}
              rows={[
                ["id", "uuid", "PK"],
                ["campId", "uuid FK", "Which camp"],
                ["userId", "text", "Who (email or session)"],
                ["event", "text", "\"preview_batch\", \"generate_batch\", \"send_batch\", \"view_setup\", \"save_config\""],
                ["metadata", "jsonb", "Event-specific data (batch size, target type, etc.)"],
                ["createdAt", "timestamp", "When"],
              ]}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          How attribution works
        </h2>
        <Card>
          <CardContent className="p-5">
            <p className="mb-2 text-sm text-muted-foreground">
              On each daily import, after updating family data:
            </p>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>
                Find families whose totalMissingForms dropped to 0 since last
                import
              </li>
              <li>
                For each, check: did they receive any sent/delivered nudges?
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    <strong>Yes →</strong> create nudge_outcome with
                    attributionType: &ldquo;nudged&rdquo;, record nudge count,
                    last tone, days to resolve
                  </li>
                  <li>
                    <strong>No →</strong> create nudge_outcome with
                    attributionType: &ldquo;organic&rdquo; (completed without
                    reminders — our control group)
                  </li>
                </ul>
              </li>
              <li>
                This gives us a natural A/B: nudged families vs. families that
                completed on their own
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outcome Dashboard (new page: /week-2/outcomes)
        </h2>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-sm font-medium">Key metrics:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li><strong>Conversion rate:</strong> X of Y nudged families completed all forms (vs. organic rate)</li>
                <li><strong>Avg days to resolve:</strong> How quickly nudged families complete vs. organic</li>
                <li><strong>Tone that converted:</strong> Breakdown of last tone sent before completion (did urgency work?)</li>
                <li><strong>Forms completed:</strong> Total forms resolved via nudged families</li>
                <li><strong>Camp comparison:</strong> Which camps see the best nudge→completion rates</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Visualizations:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Funnel: Families with missing forms → Nudged → Completed</li>
                <li>Trend line: Daily completion rate (nudged vs. organic) over time</li>
                <li>Bar chart: Completions by last escalation step (friendly/professional/urgent)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Director activity tracking
        </h2>
        <Card>
          <CardContent className="p-5">
            <p className="mb-2 text-sm text-muted-foreground">
              Lightweight event logging added to existing API routes:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>POST /api/cadence/preview → log &ldquo;preview_batch&rdquo;</li>
              <li>POST /api/cadence/run → log &ldquo;generate_batch&rdquo;</li>
              <li>POST /api/cadence/batches/[id]/send → log &ldquo;send_batch&rdquo;</li>
              <li>POST /api/cadence → log &ldquo;save_config&rdquo;</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              No new UI needed initially — query the table to answer &ldquo;are
              directors coming back?&rdquo;
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Tasks (execution order)
        </h2>
        <Card>
          <CardContent className="p-5">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li><strong>Schema + types</strong> — Create nudge_outcomes and director_events tables</li>
              <li><strong>Attribution engine</strong> — Post-import job that detects completions and creates outcome records</li>
              <li><strong>Director event logging</strong> — Add lightweight logging to existing API routes</li>
              <li><strong>Outcome queries</strong> — Aggregation functions for conversion rate, avg days, tone breakdown</li>
              <li><strong>Outcome dashboard page</strong> — /week-2/outcomes with key metrics and charts</li>
              <li><strong>Wire into import pipeline</strong> — Run attribution after each import:all</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          What this proves
        </h2>
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-sm text-muted-foreground">
              With this in place, we can answer every LFA question:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong>Inputs:</strong>{" "}
                <Badge variant="secondary" className="bg-emerald-100 text-[10px] text-emerald-800">Already tracked</Badge>{" "}
                (CSV, config, infrastructure)
              </li>
              <li>
                <strong>Outputs:</strong>{" "}
                <Badge variant="secondary" className="bg-emerald-100 text-[10px] text-emerald-800">Already tracked</Badge>{" "}
                (nudges sent, batches run)
              </li>
              <li>
                <strong>Outcomes:</strong>{" "}
                <Badge variant="secondary" className="bg-blue-100 text-[10px] text-blue-800">NEW</Badge>{" "}
                &ldquo;X% of nudged families completed forms in Y days, vs Z% organic&rdquo;
              </li>
              <li>
                <strong>Impact:</strong> Partially — the outcome data becomes
                the evidence for impact conversations with camp directors
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ParentHandbookLFA() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Inputs — What we&apos;re working with
        </h2>
        <Table
          headers={["Input", "Status", "Notes"]}
          rows={[
            ["Camp handbook documents (PDF, DOCX, TXT)", "Have", "Camps upload their own documents; processed into vector embeddings for RAG search"],
            ["5 beta camp directors actively testing", "Have", "Positive responses as of 2026-03-31; engaged in feedback loops"],
            ["RAG chatbot infrastructure (pgvector, OpenAI embeddings)", "Have", "Hybrid search (semantic + full-text) with RRF ranking, confidence scoring, guardrails"],
            ["A delivery channel parents can access", "Partially", "Embeddable widget exists; Campanion integration in progress but tag-based visibility not yet built"],
            ["Camp directors willing to configure", "Have", "Self-service dashboard for system instructions, guardrails, temperature, model selection, feature flags"],
            ["MCP server for agent-native access", "Have", "26 tools, deployed on Vercel, multi-key API auth, rate limited, E2E tested (13/13)"],
            ["OpenAI BAA-compliant AI models", "Have", "ZDR-compatible (gpt-5.4 family); using openai.chat() to avoid Responses API"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outputs — What camps experience
        </h2>
        <Table
          headers={["Output", "Status", "Notes"]}
          rows={[
            ["Parents get answers from their camp's specific handbook", "Have", "RAG chatbot scoped per-camp via vector search; streaming responses with source attribution"],
            ["Camps control what the chatbot can and can't discuss", "Have", "Guardrails enforced exactly as configured — code never reinterprets camp rules"],
            ["Camp admins see what parents are asking", "Have", "Conversation history viewer, flagged conversations, top question themes"],
            ["Knowledge gaps surface automatically", "Have", "AI detects topics parents ask about that aren't covered in uploaded documents"],
            ["Directors can draft new content from gaps", "Have", "Draft document creation from knowledge gaps with review/edit/publish workflow"],
            ["Admin copilot (CM AI) handles operational tasks", "Have", "Agent-native widget on all dashboard pages with inline cards, action chips, and 26 tools"],
            ["Embeddable widget for external sites", "Have", "widget.js with iframe embedding; CSP headers configured for cross-origin"],
            ["Camps can control rollout of features", "Have", "Per-camp feature flags (suggested questions, help links, message feedback, confidence indicators, etc.)"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outcomes — What changes in the medium-term
        </h2>
        <Table
          headers={["Outcome", "Status", "Gap?"]}
          rows={[
            ["Parents find answers without calling the camp office", "Can't measure yet", "No attribution — don't know if parents who chatted would have called otherwise"],
            ["Directors spend less time answering repetitive questions", "Anecdotal", "Directors tell us this is the goal — no baseline call/email volume to compare against"],
            ["Knowledge gaps drive handbook improvements", "Partially", "Gap detection works; need to track whether directors actually publish drafts and whether those topics stop appearing as gaps"],
            ["Parents trust the chatbot enough to use it regularly", "Can't measure yet", "No parent retention metrics — don't know if parents return or abandon after first use"],
            ["Camp handbooks become more complete over time", "Can't measure yet", "Need to compare document coverage before vs. after gap-driven content creation"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Impact — What this means for CampMinder
        </h2>
        <Table
          headers={["Impact", "Status", "Gap?"]}
          rows={[
            ["Parents feel informed and prepared before camp starts", "Not measurable yet", "Downstream of chatbot adoption — needs parent survey or NPS comparison"],
            ["Camp offices handle fewer repetitive inquiries during crunch season", "Not measurable yet", "Qualitative — needs post-pilot interviews with directors comparing this summer to last"],
            ["CampMinder proves AI can enhance the parent experience at scale", "In progress", "This experiment IS the proof — every week adds evidence for or against the model"],
            ["Handbook AI becomes a product feature camps expect from CampMinder", "Not measurable yet", "Depends on proving outcomes above; Campanion integration is the path to scale"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Key Assumptions (and risks)
        </h2>
        <Table
          headers={["Assumption", "Risk Level", "What could break it"]}
          rows={[
            ["Parents will use a chatbot instead of calling/emailing the camp", "High", "Parents may prefer human contact, especially for sensitive topics (health, safety)"],
            ["Camp handbooks contain enough info to answer common questions", "Medium", "Some camps have thin handbooks; chatbot will surface gaps but can't create content from nothing"],
            ["Directors will act on knowledge gap suggestions", "Unvalidated", "Draft workflow exists but no data on whether directors actually review, edit, and publish"],
            ["Embedding in Campanion will drive adoption", "Likely true", "It puts the chatbot where families already go — but tag-based visibility (start small) isn't built yet"],
            ["Guardrails will prevent harmful or incorrect answers", "Partially validated", "Guardrail system works but confidence scoring needs more tuning — low-confidence answers may still feel authoritative"],
            ["One-time document upload is sufficient", "Medium", "Camps update policies annually; need to track document freshness and prompt re-uploads"],
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Feedback Loops
        </h2>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-sm font-medium">Working loops:</p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>Parent asks question → RAG retrieves relevant chunks → AI answers with sources → parent gets help</li>
                <li>Question hits no documents → knowledge gap created → director sees gap → can draft content</li>
                <li>Director configures guardrails → chatbot enforces them exactly → director sees it working in test mode</li>
              </ol>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Missing loops:</p>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li><strong>No parent attribution</strong> — Parents get answers but we can&apos;t prove they would have called otherwise</li>
                <li><strong>No return-visit tracking</strong> — Don&apos;t know if parents come back or if it&apos;s one-and-done</li>
                <li><strong>No gap→publish→resolution tracking</strong> — Gap detected, draft created, but no tracking of whether published content actually resolves the gap</li>
                <li><strong>No document freshness signal</strong> — No way to tell if uploaded documents are outdated vs. current season</li>
                <li><strong>No director engagement tracking</strong> — No visibility into whether directors keep logging in or abandon after setup</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Outcome Tracking — Implementation Plan
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          A closed-loop system that answers: &ldquo;Did parents actually get help, and did camps benefit?&rdquo;
        </p>
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-2 text-sm font-semibold">Three capabilities:</h3>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li><strong>Chat-to-value tracking</strong> — When a parent gets an answer, record confidence, sources used, and whether they asked follow-ups (indicating the first answer wasn&apos;t sufficient)</li>
              <li><strong>Gap-to-resolution tracking</strong> — When a knowledge gap leads to published content, check if that topic stops appearing as a gap</li>
              <li><strong>Director engagement log</strong> — Track usage to prove adoption (login frequency, documents uploaded, drafts published, conversations reviewed)</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Tasks (execution order)
        </h2>
        <Card>
          <CardContent className="p-5">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li><strong>Schema + types</strong> — Create chatOutcome, gapResolution, and directorEvent tables</li>
              <li><strong>Director event logging</strong> — Add lightweight logging to existing dashboard API routes</li>
              <li><strong>Chat outcome engine</strong> — Post-conversation job that computes metrics and creates outcome records</li>
              <li><strong>Gap resolution tracker</strong> — Wire gap detection → draft → publish → recheck pipeline</li>
              <li><strong>Outcome queries</strong> — Aggregation functions for answer quality, gap closure, engagement</li>
              <li><strong>Outcome dashboard page</strong> — /dashboard/[slug]/outcomes with key metrics and charts</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          What this proves
        </h2>
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-sm text-muted-foreground">
              With this in place, we can answer every LFA question:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong>Inputs:</strong>{" "}
                <Badge variant="secondary" className="bg-emerald-100 text-[10px] text-emerald-800">Already tracked</Badge>{" "}
                (documents uploaded, settings configured, camps onboarded)
              </li>
              <li>
                <strong>Outputs:</strong>{" "}
                <Badge variant="secondary" className="bg-emerald-100 text-[10px] text-emerald-800">Already tracked</Badge>{" "}
                (conversations served, gaps detected, drafts created, guardrails enforced)
              </li>
              <li>
                <strong>Outcomes:</strong>{" "}
                <Badge variant="secondary" className="bg-blue-100 text-[10px] text-blue-800">NEW</Badge>{" "}
                &ldquo;X% of parent questions answered with high confidence, Y gaps resolved through published content, directors logging in Z times/week&rdquo;
              </li>
              <li>
                <strong>Impact:</strong> Partially — the outcome data becomes the evidence for impact conversations with camp directors and CampMinder leadership
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function FrameworkPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Build to Learn
        </p>
        <h1 className="text-lg font-semibold">
          Logical Framework Analysis
        </h1>
      </div>

      <Tabs defaultValue="smart-nudges">
        <TabsList>
          <TabsTrigger value="smart-nudges">Smart Nudges</TabsTrigger>
          <TabsTrigger value="parent-handbook">Parent Handbook AI</TabsTrigger>
        </TabsList>
        <TabsContent value="smart-nudges" className="pt-6">
          <SmartNudgesLFA />
        </TabsContent>
        <TabsContent value="parent-handbook" className="pt-6">
          <ParentHandbookLFA />
        </TabsContent>
      </Tabs>
    </main>
  );
}
