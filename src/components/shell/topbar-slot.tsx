"use client";

import { usePathname } from "next/navigation";

import { titleFromPath } from "@/components/shell/nav";
import { Topbar } from "@/components/shell/topbar";

export function TopbarSlot({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { title, description } = titleFromPath(pathname);

  return <Topbar title={title} description={description} onOpenMenu={onOpenMenu} />;
}
