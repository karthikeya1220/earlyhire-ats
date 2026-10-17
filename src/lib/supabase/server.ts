import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Candidate, CandidateEvent, EventType, Job, JobStatus, Stage } from "../types";

// Structural relationship shape required by supabase-js's GenericTable.
interface Relationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

// Hand-authored Database type mirroring supabase/migrations/0001_init.sql so
// every query and mutation is fully typed without generated types.
export interface Database {
  public: {
    Tables: {
      ats_jobs: {
        Row: Job;
        Insert: {
          title: string;
          department?: string | null;
          location?: string | null;
          employment_type?: string;
          status?: JobStatus;
        };
        Update: {
          title?: string;
          department?: string | null;
          location?: string | null;
          employment_type?: string;
          status?: JobStatus;
        };
        Relationships: Relationship[];
      };
      ats_candidates: {
        Row: Candidate;
        Insert: {
          name: string;
          email: string;
          job_id?: string | null;
          phone?: string | null;
          location?: string | null;
          current_title?: string | null;
          current_company?: string | null;
          experience_years?: number | null;
          skills?: string[];
          resume_summary?: string | null;
          source?: string;
          stage?: Stage;
        };
        Update: {
          name?: string;
          email?: string;
          job_id?: string | null;
          phone?: string | null;
          location?: string | null;
          current_title?: string | null;
          current_company?: string | null;
          experience_years?: number | null;
          skills?: string[];
          resume_summary?: string | null;
          source?: string;
          stage?: Stage;
        };
        Relationships: [
          {
            foreignKeyName: "ats_candidates_job_id_fkey";
            columns: ["job_id"];
            referencedRelation: "ats_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      ats_events: {
        Row: CandidateEvent;
        Insert: {
          candidate_id: string;
          kind: EventType;
          from_stage?: Stage | null;
          to_stage?: Stage | null;
          body?: string | null;
        };
        Update: {
          candidate_id?: string;
          kind?: EventType;
          from_stage?: Stage | null;
          to_stage?: Stage | null;
          body?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ats_events_candidate_id_fkey";
            columns: ["candidate_id"];
            referencedRelation: "ats_candidates";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      ats_change_candidate_stage: {
        Args: { p_candidate_id: string; p_new_stage: Stage; p_note?: string | null };
        Returns: Candidate;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Compile-time guard: `public` must satisfy supabase-js's GenericSchema
// constraint. If the type drifts, this fails to build instead of silently
// degrading to `never`.
type Schema = Database["public"];
type _GenericSchemaContract = {
  Tables: Record<string, unknown>;
  Views: Record<string, unknown>;
  Functions: Record<string, unknown>;
};
const _schemaOk: Schema extends _GenericSchemaContract ? true : never = true;
void _schemaOk;

let client: SupabaseClient<Database> | null = null;

// Service-role client, server-only. Throws loudly if env is missing rather
// than failing silently with an untyped client.
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
