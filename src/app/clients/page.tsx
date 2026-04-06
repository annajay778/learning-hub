export const dynamic = "force-dynamic";

import { getClients, getClientFeedback } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackForm } from "@/components/feedback-form";

const PROTOTYPE_COLORS: Record<string, string> = {
  "smart-nudge": "bg-blue-100 text-blue-800",
  "parent-handbook": "bg-purple-100 text-purple-800",
  general: "bg-gray-200 text-gray-800",
};

export default async function ClientsPage() {
  const [clients, feedback] = await Promise.all([
    getClients(),
    getClientFeedback(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Build to Learn
        </p>
        <h1 className="text-lg font-semibold">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Beta camps and feedback from client calls
        </p>
      </div>

      {/* Camp cards */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            The 6 Chosen Beta Camps
          </h2>
          <a
            href="https://beta-profiles.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            See all 20 candidates
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const contacts = client.contacts as { name: string; email: string }[];
            const clientFeedback = feedback.filter(
              (f) => f.clientId === client.id
            );

            return (
              <Card key={client.id}>
                <CardContent className="p-4">
                  <div className="mb-1 flex items-start justify-between">
                    <h3 className="text-sm font-semibold">{client.name}</h3>
                    {clientFeedback.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-[9px] text-emerald-800"
                      >
                        {clientFeedback.length} note{clientFeedback.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {client.location}
                  </p>
                  {client.campType && (
                    <p className="text-[10px] text-muted-foreground/60">
                      {client.campType}
                    </p>
                  )}
                  {client.stats && (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground/70">
                      {client.stats}
                    </p>
                  )}
                  {contacts.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {contacts.map((c) => (
                        <p
                          key={c.email}
                          className="text-[10px] text-muted-foreground"
                        >
                          {c.name} — {c.email}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Feedback
        </h2>
        <FeedbackForm clients={clients} />
        {feedback.length > 0 && (
          <div className="mt-3 space-y-2.5">
            {feedback.map((f) => (
              <Card key={f.id}>
                <CardContent className="p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {"clientName" in f ? (f.clientName as string) : ""}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(f.callDate + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`px-1.5 py-0 text-[9px] font-normal ${PROTOTYPE_COLORS[f.prototype] || ""}`}
                    >
                      {f.prototype === "smart-nudge"
                        ? "Smart Nudge"
                        : f.prototype === "parent-handbook"
                        ? "Parent Handbook"
                        : "General"}
                    </Badge>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {f.body}
                  </p>
                  <p className="mt-1.5 text-[10px] text-muted-foreground/50">
                    — {f.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
