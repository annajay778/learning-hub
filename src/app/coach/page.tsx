export const dynamic = "force-dynamic";

import { getCoachNotes } from "@/lib/actions";
import { CoachForm } from "@/components/coach-form";
import { CoachNoteCard } from "@/components/coach-note-card";
import { MessageCircle } from "lucide-react";

export default async function CoachPage() {
  const notes = await getCoachNotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <MessageCircle className="h-5 w-5 text-primary" />
          Coach&apos;s Corner
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A space for coaching observations, suggestions, and feedback
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
