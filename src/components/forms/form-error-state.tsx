"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FormErrorState({
  title,
  description,
  reset,
  backHref,
  backLabel,
}: {
  title: string;
  description: string;
  reset: () => void;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
