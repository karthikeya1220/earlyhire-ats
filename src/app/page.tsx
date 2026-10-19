import type { Metadata } from "next";

import { LandingNav } from "@/components/marketing/landing-nav";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ProductProof } from "@/components/marketing/product-proof";
import { LandingWorkflow } from "@/components/marketing/landing-workflow";
import { LandingFeatures } from "@/components/marketing/landing-features";
import {
  LandingCta,
  LandingFooter,
} from "@/components/marketing/landing-closing";

export const metadata: Metadata = {
  title: { absolute: "EarlyHire ATS — Recruiter-first applicant tracking" },
  description:
    "EarlyHire brings job openings, candidate pipelines, and recruiting activity into one focused workspace. Open the seeded demo and explore.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-marketing-bg text-marketing-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-marketing-line focus:bg-marketing-bg focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-marketing-ink focus:shadow-md"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main">
        <LandingHero />
        <ProductProof />
        <LandingWorkflow />
        <LandingFeatures />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
