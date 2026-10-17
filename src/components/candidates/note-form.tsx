"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Check, Send } from "lucide-react";

import { addNote } from "@/lib/actions";
import { Button } from "@/components/ui/button";

const MAX_NOTE = 4000;

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
    >
      <Send aria-hidden="true" className="h-4 w-4" />
      {pending ? "Adding…" : "Add note"}
    </Button>
  );
}

export function NoteForm({ candidateId }: { candidateId: string }) {
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  // A server action that closes over `candidateId`. A success means the row
  // committed — only then do we clear the textarea. A failure keeps the draft
  // intact and surfaces the field-level or database message; we never claim
  // success early.
  const formAction = async (formData: FormData) => {
    setError(null);
    setSaved(false);
    try {
      const result = await addNote(candidateId, null, formData);
      if (result.status === "success") {
        setBody("");
        setSaved(true);
        return;
      }
      setError(
        result.fieldErrors?.body?.[0] ??
          result.message ??
          "Could not add note.",
      );
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    }
  };

  const trimmed = body.trim();
  const isEmpty = trimmed.length === 0;

  return (
    <section
      aria-labelledby="note-heading"
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
    >
      <div>
        <h2 id="note-heading" className="text-sm font-medium text-foreground">
          Add a note
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Notes are timestamped and appear in the activity timeline.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-2">
        <label className="sr-only" htmlFor="note-body">
          Note
        </label>
        <textarea
          id="note-body"
          name="body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) setError(null);
            if (saved) setSaved(false);
          }}
          rows={3}
          maxLength={MAX_NOTE}
          placeholder="e.g. Phone screen went well — strong fundamentals, advancing to technical round."
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "note-hint note-error" : "note-hint"}
          className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex items-center justify-between gap-3">
          <p
            id="note-hint"
            className="text-xs tabular-nums text-muted-foreground"
          >
            {body.length}/{MAX_NOTE}
          </p>
          <SubmitButton disabled={isEmpty} />
        </div>

        {error && (
          <p id="note-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        {saved && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-xs text-success"
          >
            <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Note added to the activity timeline.
          </p>
        )}
      </form>
    </section>
  );
}
