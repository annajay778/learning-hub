"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientFeedback } from "@/lib/actions";
import { Plus, X } from "lucide-react";

interface Client {
  id: string;
  name: string;
}

export function FeedbackForm({ clients }: { clients: Client[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clientId, setClientId] = useState("");
  const [prototype, setPrototype] = useState("general");

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("clientId", clientId);
    formData.set("prototype", prototype);
    await createClientFeedback(formData);
    formRef.current?.reset();
    setClientId("");
    setPrototype("general");
    setSubmitting(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        <Plus className="mr-1 h-3 w-3" /> Add Feedback
      </Button>
    );
  }

  return (
    <Card className="border-dashed border-primary/30">
      <CardContent className="p-3.5">
        <form ref={formRef} action={handleSubmit} className="space-y-2.5">
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue placeholder="Select camp..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={prototype} onValueChange={setPrototype}>
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smart-nudge">Smart Nudge</SelectItem>
              <SelectItem value="parent-handbook">Parent Handbook</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Input
            name="callDate"
            type="date"
            required
            className="h-8 text-xs"
            defaultValue={new Date().toISOString().split("T")[0]}
          />

          <Textarea
            name="body"
            placeholder="What did you hear? Key quotes, reactions, feature requests..."
            rows={3}
            required
            className="text-xs"
          />

          <div className="flex items-center justify-between">
            <Input
              name="author"
              placeholder="Your name"
              required
              className="h-8 w-32 text-xs"
            />
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-7 text-[11px]"
                disabled={submitting || !clientId}
              >
                {submitting ? "..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
