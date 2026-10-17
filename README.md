# EarlyHire — Recruiter ATS

A recruiter-first applicant tracking system for moving candidates through a
hiring pipeline with clarity. Built with Next.js 16, React 19, Supabase, and a
custom design system.

## What this is

EarlyHire tracks candidates across a 7-stage pipeline:

- Applied → Screening → Shortlisted → Interview → Offer → Joined
- Rejected (out of the active pipeline, but still counted where the candidate
  previously advanced)

The app has four surfaces:

- **Dashboard** — live pipeline overview, stage breakdown, progression ratios,
  and recent activity
- **Candidates** — search, filter, and review every candidate; add, edit, and
  move stages
- **Jobs** — manage open/closed roles and see their pipelines
- **Candidate profile** — summary, stage transition control, notes, activity
  timeline

The default landing page redirects to `/dashboard`.

## Quick start

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase values (see **Environment** below), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will land on the
dashboard.

If you are starting from an empty Supabase project, seed it with
`supabase/seed.sql` after applying `supabase/migrations/0001_init.sql`.

## Project structure

```
src/
  app/
    (shell)/               shared layout + shell for all app routes
      dashboard/           dashboard route + loading/error segments
      candidates/
        page.tsx           candidate list
        new/               create candidate
        [id]/             profile, edit, 404, loading, error
      jobs/               jobs route + loading/error segments
      layout.tsx          app shell layout
    layout.tsx            root layout, fonts, theme provider
    page.tsx              redirects to /dashboard
    globals.css           design system
  components/
    candidates/           candidate list, forms, badges, skeletons, states
    dashboard/            dashboard tiles, pipeline, funnel, activity, skeletons
    jobs/                 job list, create panel, status toggle, skeletons
    shell/                app shell, sidebar, topbar, theme toggle, nav
    forms/                shared form header, error state
    ui/                   small primitives (button, form field, sheet)
  lib/
    actions.ts            server actions for candidates/jobs/stages/notes
    candidate-filters.ts  URL filter parsing, serialization, back-link helpers
    format.ts             date/time formatting helpers
    queries.ts            Supabase reads for lists, profiles, dashboard stats
    stages.ts             pipeline stages, labels, badge styles
    supabase/server.ts    server-only Supabase client
    types.ts              app types
    validation.ts         zod schemas for forms
    utils.ts              className helpers
supabase/
  migrations/0001_init.sql  schema, RLS tables, stage-change function, indexes
  seed.sql                  fictional demo data
```

## Environment

Copy `.env.example` to `.env.local`. You need four variables.

**Server-only (never prefix with `NEXT_PUBLIC_` — these must not reach the
browser):**

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key bypasses Row Level Security. In this app it is used only in
server actions and server components through `src/lib/supabase/server.ts`. It is
never shipped to the client.

**Client-safe (these are published to the browser; they are RLS-scoped, not
admin):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Client vs server credentials

The client-safe public key is for RLS-scoped client access. EarlyHire does not
currently initialize a client-side Supabase client in `src`. The
`NEXT_PUBLIC_SUPABASE_*` variables are declared so the app can grow into
client-side, RLS-scoped usage without changing the credential pattern.

If you later add client-side Supabase access, keep admin/service-role keys out
of any `NEXT_PUBLIC_*` variable. Only publish the RLS-scoped key.

## Database

The schema lives in `supabase/migrations/0001_init.sql`. The key ideas:

- Tables are prefixed `ats_` to avoid collisions in a shared database.
- RLS is enabled on every table with **no public policies**. All access goes
  through the Next.js server using the service-role key.
- Stage changes are written through the Postgres function
  `ats_change_candidate_stage`, which updates the candidate and writes one
  `stage_change` event in the same transaction.
- `ats_events` records both stage changes and recruiter notes, in chronological
  order per candidate.

Do not edit the schema or seed data as part of normal app work. The app's
metrics, stage logic, and empty/error states are built against this schema.

## Design system

The design system is defined in `src/app/globals.css`. It uses:

- A neutral, slightly cool gray palette
- An indigo accent used sparingly for primary actions and active navigation
- An emerald accent for successful states and an orange/rose set for offer and
  rejected stages
- Compact density — recruiters scan tables and pipelines, so spacing favors
  information over decoration

Badges and pipeline bars read from `src/components/candidates/stage-badge-styles.ts`
so colors stay consistent and adapt automatically in dark mode.

## Dashboard metrics

All dashboard numbers are computed per request from Supabase. Nothing is
hardcoded.

- **Total candidates** — count of `ats_candidates` rows
- **Open roles / closed roles** — counts of `ats_jobs` by status
- **Active pipeline** — candidates currently in Applied through Offer
- **Current by stage** — candidates whose current stage is that stage; these sum
  to the total
- **Reached by stage** — distinct candidates with a `stage_change` event to that
  stage, unioned with anyone currently in it; these do not sum to the total
- **Stage progression** — for each adjacent pair, of the candidates who reached
  the earlier stage, how many also reached the next one. These are
  stage-progression ratios, not a hiring success rate
- **Recent activity** — the latest 8 real events, with candidate names, plain
  descriptions, and exact timestamps

### What the dashboard does not claim

It does not invent time-in-stage or bottleneck metrics. Any such number would
require event history that is not guaranteed to be complete.

## Routing and loading behavior

Each dynamic route has loading, error, and not-found segments where appropriate:

- `/dashboard`
- `/candidates`
- `/candidates/new`
- `/candidates/[id]`
- `/candidates/[id]/edit`
- `/jobs`

Data fetching uses Next.js Suspense boundaries so the shell can prerender and the
dynamic content streams in at request time. That means the build should never bake
in a stale snapshot of your candidate counts. If you run `next build`, the dynamic
routes render as partially prerendered, not fully static.

## Accessibility

- Navigation uses real `aria-current` on the active link
- Stage bars and badges pair color with text and `aria-hidden` where the color is
  decorative
- Forms announce field-level errors through `aria-describedby` and `aria-invalid`
- Reject is a two-step confirmation so destructive actions are explicit
- Loading states use `role="status"` and `aria-label` so screen readers get an
  honest interim state

## Testing the app locally

The fastest local feedback loop is:

```bash
npm run dev
```

Open the app and exercise:

1. Dashboard — confirm it shows real counts and recent activity
2. Candidates — search by name/email/title/company, filter by stage and role
3. New candidate — create one, confirm it enters at Applied and appears in the
   list and dashboard
4. Profile — move a candidate through stages, add a note, watch the timeline
5. Jobs — create a role, close it, reopen it, watch the counts and candidate
   assignment rules

If you want to reset the data, re-run `supabase/seed.sql` against your project.

## Deployment

EarlyHire is a standard Next.js app that deploys to Vercel.

### Vercel prerequisites

- A Supabase project with the schema applied and seed data loaded
- The four environment variables from **Environment** set on the Vercel project

### Vercel setup

1. Install the Vercel CLI if you want to deploy from the terminal:
   `npm i -g vercel`
2. Authenticate once: `vercel login`
3. From the repo root, link and deploy:
   ```bash
   vercel
   vercel --prod
   ```
4. Add the environment variables in the Vercel dashboard before the first
   production deploy. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as
   runtime secrets. Set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as public environment variables.

Do not set the service-role key or any other admin secret as a `NEXT_PUBLIC_*`
variable.

### GitHub deployment

If you prefer Git-driven deploys, push the repo to GitHub and connect it to
Vercel. Vercel will build on push. The same four environment variables are still
required on the Vercel project.

## Reference

- [Next.js docs](https://nextjs.org/docs)
- [Supabase docs](https://supabase.com/docs)
- [next-themes](https://github.com/pacocoursey/next-themes)
