import type {
  DashboardActivityItem,
  DashboardConversionStep,
  Job,
  Stage,
} from "@/lib/types";

// Fixtures for the landing-page previews. Every number and name here comes
// from the seeded demo dataset in supabase/seed.sql, as rendered by the live
// dashboard at review time (30 candidates, 5 open jobs, funnel 30→24→17→11→7→4).
// Nothing is invented: the landing page shows the sample workspace, labeled as
// such, and links into the real app routes that serve it.

export const SAMPLE_WORKSPACE_NOTE =
  "Sample workspace — the seeded demo dataset that ships with EarlyHire.";

export const sampleStats = {
  totalCandidates: 30,
  openRoles: 5,
  closedRoles: 1,
  activeCandidates: 21,
  rejectedCount: 5,
} as const;

export const sampleCurrentByStage: Record<Stage, number> = {
  applied: 6,
  screening: 5,
  shortlisted: 3,
  interview: 4,
  offer: 3,
  joined: 4,
  rejected: 5,
};

export const sampleReachedByStage: Record<Stage, number> = {
  applied: 30,
  screening: 24,
  shortlisted: 17,
  interview: 11,
  offer: 7,
  joined: 4,
  rejected: 5,
};

export const sampleFunnelSteps: DashboardConversionStep[] = [
  { from: "applied", to: "screening", fromCount: 30, toCount: 24, rate: 80 },
  {
    from: "screening",
    to: "shortlisted",
    fromCount: 24,
    toCount: 17,
    rate: 70.8,
  },
  { from: "shortlisted", to: "interview", fromCount: 17, toCount: 11, rate: 64.7 },
  { from: "interview", to: "offer", fromCount: 11, toCount: 7, rate: 63.6 },
  { from: "offer", to: "joined", fromCount: 7, toCount: 4, rate: 57.1 },
];

const activityNeha: DashboardActivityItem = {
  id: "sample-activity-neha",
  candidateId: "00000000-0000-4000-8000-000000000128",
  candidateName: "Neha Chawla",
  kind: "stage_change",
  fromStage: null,
  toStage: "applied",
  body: null,
  createdAt: "2026-10-12T11:16:54+00:00",
};

const activityNaveen: DashboardActivityItem = {
  id: "sample-activity-naveen",
  candidateId: "00000000-0000-4000-8000-000000000123",
  candidateName: "Naveen Kumar",
  kind: "stage_change",
  fromStage: null,
  toStage: "applied",
  body: null,
  createdAt: "2026-10-11T11:16:54+00:00",
};

const activityZoya: DashboardActivityItem = {
  id: "sample-activity-zoya",
  candidateId: "00000000-0000-4000-8000-000000000118",
  candidateName: "Zoya Khan",
  kind: "stage_change",
  fromStage: null,
  toStage: "applied",
  body: null,
  createdAt: "2026-10-09T11:16:54+00:00",
};

const activityPooja: DashboardActivityItem = {
  id: "sample-activity-pooja",
  candidateId: "00000000-0000-4000-8000-000000000122",
  candidateName: "Pooja Reddy",
  kind: "stage_change",
  fromStage: "applied",
  toStage: "screening",
  body: null,
  createdAt: "2026-09-27T23:16:54+00:00",
};

const activityAarav: DashboardActivityItem = {
  id: "sample-activity-aarav",
  candidateId: "00000000-0000-4000-8000-000000000101",
  candidateName: "Aarav Mehta",
  kind: "note",
  fromStage: null,
  toStage: null,
  body: "System design round went well — clear on data-fetching strategy and cache invalidation. Waiting on the culture-fit slot.",
  createdAt: "2026-09-27T11:16:54+00:00",
};

// Newest first, matching the dashboard feed.
export const sampleActivityAll: DashboardActivityItem[] = [
  activityNeha,
  activityNaveen,
  activityZoya,
  activityPooja,
  activityAarav,
];

export const sampleActivityHero = sampleActivityAll.slice(0, 3);

export const sampleActivityFeatured: DashboardActivityItem[] = [
  activityPooja,
  activityAarav,
  activityNeha,
];

export const sampleJobs: Job[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    status: "open",
    created_at: "2026-08-11T10:00:00+00:00",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Bengaluru",
    employment_type: "Full-time",
    status: "open",
    created_at: "2026-08-16T10:00:00+00:00",
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    title: "Customer Success Manager",
    department: "Customer",
    location: "Chennai",
    employment_type: "Full-time",
    status: "closed",
    created_at: "2026-07-21T10:00:00+00:00",
  },
];

export const sampleDiscoveryCandidates = [
  {
    id: "00000000-0000-4000-8000-000000000103",
    name: "Rohan Desai",
    title: "Software Engineer",
    company: "Nimbus Softworks",
    stage: "applied" as Stage,
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    name: "Kavya Iyer",
    title: "Frontend Engineer",
    company: "Pixelforge",
    stage: "screening" as Stage,
  },
  {
    id: "00000000-0000-4000-8000-000000000108",
    name: "Sneha Kulkarni",
    title: "Software Engineer II",
    company: "Cloudnest",
    stage: "shortlisted" as Stage,
  },
];

export const sampleProfile = {
  id: "00000000-0000-4000-8000-000000000101",
  name: "Aarav Mehta",
  title: "Frontend Lead",
  company: "Zeta Systems",
  stage: "interview" as Stage,
  location: "Bengaluru",
  source: "Referral",
  experienceYears: 6,
  jobTitle: "Senior Frontend Engineer",
};
