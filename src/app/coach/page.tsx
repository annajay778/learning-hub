export const dynamic = "force-dynamic";

import { getCoachNotes } from "@/lib/actions";
import { CoachForm } from "@/components/coach-form";
import { CoachNoteCard } from "@/components/coach-note-card";

export default async function CoachPage() {
  const notes = await getCoachNotes();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Build to Learn
        </p>
        <h1 className="font-serif text-base font-medium">
          Coach&apos;s Corner
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Coaching observations, suggestions, and feedback
        </p>
      </div>

      <CoachForm />

      {notes.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No notes yet. Share a thought above to get started.
        </p>
      ) : (
        <div className="space-y-2.5">
          {notes.map((note) => (
            <CoachNoteCard
              key={note.id}
              id={note.id}
              author={note.author}
              body={note.body}
              reviewed={note.reviewed}
              createdAt={note.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
