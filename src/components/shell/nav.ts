import { LayoutDashboard, Users, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Pipeline overview and hiring health",
    icon: LayoutDashboard,
  },
  {
    href: "/candidates",
    label: "Candidates",
    description: "Browse, filter, and manage applicants",
    icon: Users,
  },
  {
    href: "/jobs",
    label: "Jobs",
    description: "Open roles and their pipelines",
    icon: Briefcase,
  },
];

export function titleFromPath(pathname: string): {
  title: string;
  description: string;
} {
  const match = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  if (match) {
    return { title: match.label, description: match.description };
  }

  return { title: "Dashboard", description: NAV_ITEMS[0].description };
}
