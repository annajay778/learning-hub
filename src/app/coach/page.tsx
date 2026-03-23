export const dynamic = "force-dynamic";

import { getCoachNotes } from "@/lib/actions";
import { CoachForm } from "@/components/coach-form";
import { CoachNoteCard } from "@/components/coach-note-card";

export default async function CoachPage() {
  const notes = await getCoachNotes();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">
          Coach&apos;s Corner
        </h1>
        <p className="mt-2 text-muted-foreground">
          Coaching observations, suggestions, and feedback
        </p>
      </div>

      <CoachForm />

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notes yet. Share a thought above to get started.
        </p>
      ) : (
        <div className="space-y-3">
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
    </div>
  );
}
