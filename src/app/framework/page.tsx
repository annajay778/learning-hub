export const dynamic = "force-dynamic";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  Have: "bg-emerald-100 text-emerald-800",
  "Can't measure yet": "bg-amber-100 text-amber-800",
  Anecdotal: "bg-amber-100 text-amber-800",
  Partially: "bg-blue-100 text-blue-800",
  "Not measurable": "bg-gray-200 text-gray-700",
  "Not measurable from our data": "bg-gray-200 text-gray-700",
  "In progress": "bg-blue-100 text-blue-800",
  High: "bg-red-100 text-red-800",
  Unvalidated: "bg-amber-100 text-amber-800",
  "Likely true": "bg-emerald-100 text-emerald-800",
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

export default function FrameworkPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Build to Learn
        </p>
        <h1 className="text-lg font-semibold">
          Smart Nudges — Logical Framework Analysis
        </h1>
      </div>

      {/* ── INPUTS ──────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Inputs — Resources we invest
        </h2>
        <Table
          headers={["Input", "Status", "Notes"]}
          rows={[
            ["Daily CSV pipeline", "Have", "6 camps, daily email download + parse"],
            ["Parent contact data", "Have", "Phone, email, opt-in from Campminder"],
            ["Session start dates", "Have", "Parsed from CSV, carried through pipeline"],
            ["Camp director time (config)", "Have", "Setup page, ~2 min to configure"],
            ["Twilio SMS infrastructure", "Have", "Toll-free, Camp Colorado live"],
            ["Message templates (3 tones)", "Have", "Customizable per camp"],
            ["Form completion data", "Have", "Daily snapshots track totals"],
          ]}
        />
      </section>

      {/* ── OUTPUTS ─────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outputs — What we produce
        </h2>
        <Table
          headers={["Output", "Status", "Notes"]}
          rows={[
            ["Targeted reminders sent", "Have", "SMS + email stub, session-aware filtering"],
            ["Preview before send", "Have", "Glass Box — preview → generate → send"],
            ["Skip reasons explained", "Have", "Grouped by reason in preview + batch history"],
            ["Daily form completion snapshots", "Have", "Per-camp totals tracked"],
            ["Example schedule calendar", "Have", "Shows exactly when each reminder fires"],
          ]}
        />
      </section>

      {/* ── OUTCOMES ────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outcomes — What changes in the medium-term
        </h2>
        <Table
          headers={["Outcome", "Status", "Gap?"]}
          rows={[
            ["Families submit forms faster", "Can't measure yet", "We see total forms drop in snapshots, but can't attribute to nudges vs. organic"],
            ["Directors save follow-up time", "Anecdotal", "No time-tracking or comparison baseline"],
            ["Fewer incomplete families at session start", "Can't measure yet", "Need a \"% complete by session start\" metric"],
            ["Directors trust the system", "Partially", "Glass Box helps; need to track adoption (do they keep using it?)"],
          ]}
        />
      </section>

      {/* ── IMPACT ──────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Impact — Long-term difference
        </h2>
        <Table
          headers={["Impact", "Status", "Gap?"]}
          rows={[
            ["Smoother opening days", "Not measurable from our data", "Would need post-session camp feedback"],
            ["Better camper safety (health forms)", "Not measurable", "Downstream of form completion"],
            ["Directors focus on programs, not admin", "Not measurable", "Qualitative, needs interviews"],
            ["Model for AI-powered camp operations", "In progress", "This IS the prototype proving the model"],
          ]}
        />
      </section>

      {/* ── ASSUMPTIONS ─────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Key Assumptions (and risks)
        </h2>
        <Table
          headers={["Assumption", "Risk Level", "What could break it"]}
          rows={[
            ["Parents act on SMS reminders", "High", "They ignore/block unknown numbers"],
            ["3-tone escalation drives action", "Unvalidated", "No data on which tone converts"],
            ["Session proximity creates urgency", "Likely true", "But some camps don't think in sessions"],
            ["Daily CSV arrives reliably", "Low", "Campminder email pipeline is stable"],
          ]}
        />
      </section>

      {/* ── FEEDBACK LOOPS ──────────────────────────── */}
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

      {/* ── OUTCOME TRACKING PLAN ───────────────────── */}
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

      {/* ── DATA MODEL ──────────────────────────────── */}
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

      {/* ── HOW ATTRIBUTION WORKS ───────────────────── */}
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

      {/* ── OUTCOME DASHBOARD ───────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Outcome Dashboard (new page: /week-2/outcomes)
        </h2>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-sm font-medium">Key metrics:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>
                  <strong>Conversion rate:</strong> X of Y nudged families
                  completed all forms (vs. organic rate)
                </li>
                <li>
                  <strong>Avg days to resolve:</strong> How quickly nudged
                  families complete vs. organic
                </li>
                <li>
                  <strong>Tone that converted:</strong> Breakdown of last tone
                  sent before completion (did urgency work?)
                </li>
                <li>
                  <strong>Forms completed:</strong> Total forms resolved via
                  nudged families
                </li>
                <li>
                  <strong>Camp comparison:</strong> Which camps see the best
                  nudge→completion rates
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Visualizations:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>
                  Funnel: Families with missing forms → Nudged → Completed
                </li>
                <li>
                  Trend line: Daily completion rate (nudged vs. organic) over
                  time
                </li>
                <li>
                  Bar chart: Completions by last escalation step
                  (friendly/professional/urgent)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── DIRECTOR ACTIVITY TRACKING ──────────────── */}
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
              <li>
                POST /api/cadence/preview → log
                &ldquo;preview_batch&rdquo;
              </li>
              <li>
                POST /api/cadence/run → log
                &ldquo;generate_batch&rdquo;
              </li>
              <li>
                POST /api/cadence/batches/[id]/send → log
                &ldquo;send_batch&rdquo;
              </li>
              <li>
                POST /api/cadence → log &ldquo;save_config&rdquo;
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              No new UI needed initially — query the table to answer &ldquo;are
              directors coming back?&rdquo;
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── TASKS ───────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Tasks (execution order)
        </h2>
        <Card>
          <CardContent className="p-5">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Schema + types</strong> — Create nudge_outcomes and
                director_events tables
              </li>
              <li>
                <strong>Attribution engine</strong> — Post-import job that
                detects completions and creates outcome records
              </li>
              <li>
                <strong>Director event logging</strong> — Add lightweight
                logging to existing API routes
              </li>
              <li>
                <strong>Outcome queries</strong> — Aggregation functions for
                conversion rate, avg days, tone breakdown
              </li>
              <li>
                <strong>Outcome dashboard page</strong> — /week-2/outcomes with
                key metrics and charts
              </li>
              <li>
                <strong>Wire into import pipeline</strong> — Run attribution
                after each import:all
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* ── WHAT THIS PROVES ────────────────────────── */}
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
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-[10px] text-emerald-800"
                >
                  Already tracked
                </Badge>{" "}
                (CSV, config, infrastructure)
              </li>
              <li>
                <strong>Outputs:</strong>{" "}
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-[10px] text-emerald-800"
                >
                  Already tracked
                </Badge>{" "}
                (nudges sent, batches run)
              </li>
              <li>
                <strong>Outcomes:</strong>{" "}
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-[10px] text-blue-800"
                >
                  NEW
                </Badge>{" "}
                &ldquo;X% of nudged families completed forms in Y days, vs Z%
                organic&rdquo;
              </li>
              <li>
                <strong>Impact:</strong> Partially — the outcome data becomes
                the evidence for impact conversations with camp directors
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
