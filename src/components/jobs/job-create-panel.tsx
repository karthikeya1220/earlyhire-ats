"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JobCreateForm } from "@/components/jobs/job-create-form";

export function JobCreatePanel({
  openCount,
  closedCount,
  defaultOpen = false,
}: {
  openCount: number;
  closedCount: number;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <section aria-labelledby="roles-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="roles-heading" className="text-title text-foreground">
            Roles
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {openCount} open · {closedCount} closed
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isOpen ? "outline" : "primary"}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls="new-role-form"
        >
          {isOpen ? (
            <X aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Plus aria-hidden="true" className="h-4 w-4" />
          )}
          {isOpen ? "Close form" : "New role"}
        </Button>
      </div>

      <div id="new-role-form">
        {isOpen && <JobCreateForm onCancel={() => setIsOpen(false)} />}
      </div>
    </section>
  );
}
