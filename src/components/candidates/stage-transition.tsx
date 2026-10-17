"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { changeStage } from "@/lib/actions";
import { CANDIDATE_STAGE_OPTIONS } from "@/lib/candidate-filters";
import { STAGE_LABELS, type Stage } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/candidates/stage-badge";

// Happy-path pipeline, shown as a compact progress rail. `rejected` is off
// this rail because it removes the candidate from the active pipeline.
const PIPELINE_STAGES: readonly Stage[] = [
  "applied",
  "screening",
  "shortlisted",
  "interview",
  "offer",
  "joined",
];

type Feedback = { status: "success" | "error"; message: string } | null;

function StageSubmitButton({
  selected,
  buttonRef,
}: {
  selected: Stage | null;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      ref={buttonRef}
      type="submit"
      size="sm"
      disabled={pending || !selected}
    >
      {pending ? (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      )}
      {pending
        ? "Moving…"
        : selected
          ? `Move to ${STAGE_LABELS[selected]}`
          : "Select a stage"}
    </Button>
  );
}

function ConfirmRejectButton({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      ref={buttonRef}
      type="submit"
      variant="destructive"
      size="sm"
      disabled={pending}
    >
      <Check aria-hidden="true" className="h-4 w-4" />
      {pending ? "Rejecting…" : "Yes, reject"}
    </Button>
  );
}

export function StageTransitionControl({
  candidateId,
  candidateName,
  currentStage,
}: {
  candidateId: string;
  candidateName: string;
  currentStage: Stage;
}) {
  const [selected, setSelected] = React.useState<Stage | null>(null);
  const [confirming, setConfirming] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  const submitRef = React.useRef<HTMLButtonElement>(null);

  const stageOptions = CANDIDATE_STAGE_OPTIONS.filter((s) => s !== currentStage);
  const isRejected = currentStage === "rejected";
  const pipelineIndex = PIPELINE_STAGES.indexOf(currentStage);

  // Move focus into the confirmation so keyboard users are not left on a
  // button whose action now requires a second, explicit step.
  React.useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const onSelect = (stage: Stage) => {
    setSelected(stage);
    setConfirming(false);
    setFeedback(null);
  };

  const cancelConfirm = () => {
    setConfirming(false);
    setFeedback(null);
    requestAnimationFrame(() => submitRef.current?.focus());
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!selected) {
      e.preventDefault();
      setFeedback({ status: "error", message: "Choose a stage first." });
      return;
    }
    // Rejection is destructive and outward-facing: require an explicit second
    // action that names the candidate and the consequence.
    if (selected === "rejected" && !confirming) {
      e.preventDefault();
      setFeedback(null);
      setConfirming(true);
    }
  };

  // A server action that closes over `candidateId`. Passing a bound server
  // action directly as `action` doesn't typecheck against the form signature,
  // so we wrap it. The RPC still runs on the server in one transaction.
  const onStageAction = async (formData: FormData) => {
    try {
      const result = await changeStage(candidateId, null, formData);
      if (result.status === "success") {
        setSelected(null);
        setConfirming(false);
        setFeedback({
          status: "success",
          message: result.message ?? "Stage updated.",
        });
        return;
      }
      // Keep the chosen stage (and an open rejection confirmation) so a
      // transient failure doesn't discard the recruiter's intent.
      setFeedback({
        status: "error",
        message: result.message ?? "Could not change stage.",
      });
    } catch {
      setFeedback({
        status: "error",
        message: "Could not reach the server. Check your connection and try again.",
      });
    }
  };

  return (
    <section
      aria-labelledby="stage-heading"
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="stage-heading" className="text-sm font-medium text-foreground">
            Move stage
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Stage changes are recorded in the activity timeline.
          </p>
        </div>
        <StageBadge stage={currentStage} className="shrink-0" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          {isRejected
            ? "Out of the active pipeline"
            : `Step ${pipelineIndex + 1} of ${PIPELINE_STAGES.length}`}
        </p>
        <ol aria-hidden="true" className="mt-1.5 flex gap-1">
          {PIPELINE_STAGES.map((stage, index) => (
            <li key={stage} className="flex-1">
              <span
                className={cn(
                  "block h-1.5 rounded-full",
                  isRejected
                    ? "bg-destructive/30"
                    : index <= pipelineIndex
                      ? "bg-primary"
                      : "bg-muted",
                )}
              />
            </li>
          ))}
        </ol>
      </div>

      <form
        action={onStageAction}
        onSubmit={onSubmit}
        className="flex flex-col gap-3"
      >
        <fieldset>
          <legend className="sr-only">
            Move {candidateName} to stage
          </legend>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {stageOptions.map((stage) => {
              const isChosen = selected === stage;
              return (
                <label
                  key={stage}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-card",
                    isChosen
                      ? stage === "rejected"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-subtle hover:text-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="stage"
                    value={stage}
                    checked={isChosen}
                    onChange={() => onSelect(stage)}
                    className="sr-only"
                  />
                  {STAGE_LABELS[stage]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            Currently {STAGE_LABELS[currentStage]}
          </p>
          <StageSubmitButton selected={selected} buttonRef={submitRef} />
        </div>

        {selected === "rejected" && confirming && (
          <div className="flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p
              role="alert"
              className="flex items-start gap-2 text-xs text-foreground"
            >
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
              />
              <span>
                Reject{" "}
                <span className="font-medium">{candidateName}</span>? This moves
                them out of the active pipeline and is recorded in their
                history.
              </span>
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cancelConfirm}
              >
                Cancel
              </Button>
              <ConfirmRejectButton buttonRef={confirmRef} />
            </div>
          </div>
        )}

        {feedback && (
          <p
            role={feedback.status === "error" ? "alert" : "status"}
            className={cn(
              "flex items-start gap-1.5 text-xs",
              feedback.status === "error"
                ? "text-destructive"
                : "text-success",
            )}
          >
            {feedback.status === "error" ? (
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />
            ) : (
              <Check
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />
            )}
            {feedback.message}
          </p>
        )}
      </form>
    </section>
  );
}
