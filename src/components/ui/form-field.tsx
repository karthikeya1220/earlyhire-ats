import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Shared field chrome so candidate and role forms keep the same label, hint,
// error, and control styling as the rest of the app.
export const fieldInputClass =
  "h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive/60 aria-[invalid=true]:focus-visible:ring-destructive/25";

export const fieldSelectClass =
  "h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive/60 aria-[invalid=true]:focus-visible:ring-destructive/25";

export const fieldTextareaClass =
  "w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive/60 aria-[invalid=true]:focus-visible:ring-destructive/25";

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-destructive">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p
          id={`${id}-hint`}
          className="text-xs leading-relaxed text-muted-foreground"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Keeps aria-invalid/aria-describedby in sync with the rendered hint and error
// while disabling native validation (forms use noValidate + server validation).
export function fieldAria(
  id: string,
  options: { hint?: boolean; error?: string; required?: boolean } = {},
) {
  const describedBy = [
    options.hint ? `${id}-hint` : null,
    options.error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    "aria-invalid": options.error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    "aria-required": options.required || undefined,
  };
}
